# Negative results count too

> I designed a module that I expected to make a model more accurate. It took accuracy from 77.23% down to 56.78%.

## Background

A baseline model sat steadily at 77.23% on an image classification task, and we fixed that number as the reference point. I then designed a new attention routing module: the idea was to let the model assign weights across feature scales dynamically. It is a common pattern in papers and sounds entirely reasonable.

Before starting, we wrote the decision rule down: **under the same data split and the same evaluation protocol, if the new module does not deliver a stable improvement, it counts as a failure, and there will be no post-hoc adjustments.** At the time I found this step a bit ceremonial. I did it anyway.

## Result

| Configuration | Best accuracy | Notes |
| --- | --- | --- |
| Baseline | 77.23% | Converges stably |
| New module (v1) | 56.78% | Training collapses at epoch 61 |
| New module (v2) | Worse | Collapses at epoch 34 |

The second version was more aggressive and collapsed earlier. By that point the direction of the problem was clear.

## Diagnosis

The routing weights were collapsing: early in training the module concentrated almost all weight on a handful of channels and effectively stopped updating the rest. The network kept running and the loss kept falling, but the model had already abandoned most of its features. "Dynamic weight allocation" had degenerated into "use one channel".

No learning rate or initialisation tweak fixes that — it is a design problem. The normalisation I used for the routing self-reinforces: once one channel gains a slight edge, it gets amplified into dominance.

## Why I documented the failure in full

Because it was more valuable than a success would have been, in three ways:

1. **It proved the evaluation protocol was worth having.** Without a pre-written rule, "56.78%" is easy to explain away as "hyperparameters need tuning" or "it just needs to train longer" — and the work drags on indefinitely.
2. **It produced a reusable diagnostic path.** The routing-collapse signature, and the method used to find it (looking at weight distributions over training, not just the loss), have since been applied to other models.
3. **It saves the next person time.** The failing configuration, the epoch it collapsed at, and why v2 collapsed earlier are all in the experiment record.

## How I run experiments now

- The decision rule is written before the run starts, somewhere inconvenient to change
- Failed experiments use the same record format as successful ones; "tried it, did not work" is never an acceptable line
- Conclusions state only what the experiment supports; "looks promising but unverified" is labelled as unverified

It is easiest to fool yourself in research. Writing the standard down in advance is the cheapest defence against it.
