# Negative results count too

> I designed a module I expected to make a model more accurate. It took accuracy from 77.23% down to 56.78%.

::: info Short version
- The most valuable finding was not "the module does not work" but that **the collapse is invisible in the loss**: the loss fell normally for the whole run while the model had already abandoned most of its features;
- Writing the decision rule down in advance turned "56.78%" from "maybe more tuning would fix it" into an executable failure verdict — what it saved was open-ended delay;
- The cause is a design flaw (self-reinforcing routing normalisation), not something a learning rate or initialisation change can fix.
:::

## 1. Background: a module that sounded reasonable

The baseline sat steadily at 77.23% on an image classification task, and that number was fixed as the reference. I then designed a new attention routing module: let the model assign weights across feature scales dynamically. A common pattern in papers, and it sounds entirely reasonable.

Before starting, the decision rule was written down: **under the same data split and the same evaluation protocol, if the new module does not deliver a stable improvement, it counts as a failure, with no post-hoc adjustments.** I found the step slightly ceremonial at the time and did it anyway.

## 2. Result: both versions collapsed

| Configuration | Best accuracy | Notes |
| --- | --- | --- |
| Baseline | 77.23% | Converges stably |
| New module (v1) | 56.78% | Training collapses at epoch 61 |
| New module (v2) | Worse | Collapses at epoch 34 |

Version two was more aggressive and collapsed earlier. By that point the direction of the problem was clear.

## 3. Diagnosis: loss falling, metric dropping

The first thing I looked at was the loss curve. It fell normally from start to finish, with no anomalous spike. That is the trap: by the rule "loss is fine, so training is healthy", this run looked like it was converging.

The second observation was the metric curve. Accuracy dropped from the low seventies to around 56% over the epochs around 61, while the loss showed no matching jump. The two diverging meant the output distribution had changed while the fitted objective had not got worse.

The third observation was the routing weight distribution over training, and that is where the evidence was. Early in training the module concentrated almost all weight on a handful of channels and effectively stopped updating the rest. **The network kept running and the loss kept falling, but the model had already abandoned most of its features** — "dynamic weight allocation" had degenerated into "use one channel".

That only became visible by watching the routing weights rather than the loss, which generalises: **the quantity you monitor has to correspond to your design intent.** I added routing, so routing weights were the thing to watch.

## 4. Root cause: a normalisation that reinforces itself

No learning rate or initialisation tweak fixes this. The problem is the design: the normalisation I used for the routing self-reinforces. Once one channel gains a slight edge it is amplified into dominance, the gradients for the rest vanish, and training cannot leave that state on its own.

That explains both collapses, and why the more aggressive version collapsed earlier — the change amplified the same mechanism.

::: warning Worth noting
"Training collapsed" is usually answered with hyperparameters, but the first question should be: **does this design contain a self-reinforcing structure?** Normalisation, gating and competitive activations all tend toward winner-takes-all, and none of it shows up in the loss.
:::

## 5. Why this failure was worth more than a success

1. **It proved the evaluation protocol was worth having.** Without a pre-written rule, "56.78%" is easy to explain away as "it just needs to train longer", and the work drags on indefinitely.
2. **It produced a reusable diagnostic path.** The weight-collapse signature, and the method used to find it (weight distributions over training, not just the loss), have since been applied to other models.
3. **It saves the next person time.** The failing configuration, the collapse epoch, and why v2 collapsed earlier are all in the experiment record.

::: tip Best value for effort
Keep a fixed column in the experiment record for "which quantity tells me this is healthy", and make that quantity correspond to the design intent. Watching only the loss misses an entire class of failure — the ones that never raise an error.
:::

## 6. Reusable checklist

- The decision rule is written before the run starts, somewhere inconvenient to change;
- Monitored quantities correspond to design intent: added routing, so watch the routing weights;
- A healthy loss does not mean healthy training; when metric and loss diverge, trust the metric;
- For structures prone to winner-takes-all (normalisation, gating, competitive activations), design the check up front;
- Failed experiments use the same record format as successful ones; "tried it, did not work" is never acceptable;
- Conclusions state only what the experiment supports; "looks promising but unverified" is labelled unverified.
