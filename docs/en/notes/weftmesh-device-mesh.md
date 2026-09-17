# WeftMesh: every device is a complete agent

> September 2026. The starting point was an everyday annoyance: agents installed on a laptop, a server, a NAS and a phone, each isolated — its own configuration, its own credentials, its own progress checking, with coordination happening by hand.

::: info Short version
- The topology is a star, not a full mesh: not for performance, but because **pairwise bookkeeping produces conflicting state as devices come and go**;
- Executing code across devices means capability sharing starts closed and is granted per device;
- The counter-intuitive one: **reconnection belongs on the normal path**, not the exception path. Phones switching networks and servers restarting are ordinary events.
:::

## 1. The first idea was a full mesh

The first idea was direct connections between every pair of devices: anything can talk to anything, maximally flexible, no single point.

Conflicts appeared as soon as it ran. Two devices each kept their own view of the other, and the views disagreed after a disconnect — the phone switched networks, one side considered it online, the other offline, and both dispatched a task from their own belief, so the same task went out twice. With more devices, "every device tracks its relationship with every other" also grows combinatorially: each new device has to be introduced to everyone.

## 2. Switching to a star: state and authentication in one place

The final topology has one device as the hub and the others joining it. The immediate gain is that **there is exactly one copy of state and authentication**: who is online, what each device offers, who is authorised. Devices do not sync pairwise, and coming and going cannot produce contradictory views.

Devices speak a purpose-built lightweight protocol that handles three things:

```text
1. Capability advert   what this device offers: GPU, storage, installed tools
2. Task dispatch       hub dispatches → device executes → result returns to the origin session
3. State recovery      realign after a disconnect, rather than reset
```

The hub is not a privileged device. It is only the centre of the connection graph; the logic stays with whichever device initiated the task.

## 3. Permissions: closed by default, granted per device

"Borrowing each other's environments" means executable code moves between devices, which is the highest-risk part of the design. The rules are deliberately hard:

- Capability sharing is **off by default**, granted per device;
- Task provenance must be verifiable, not forgeable by any endpoint;
- What a device can be asked to do is declared by the provider, not specified by the caller.

::: warning Worth noting
The part most often overlooked when running code across devices is not transport encryption, it is the **authorisation boundary**: once a device may execute arbitrary code, it stops being "my other computer" and becomes an execution node in a network. Closed by default is not conservatism, it is the necessary default for this class of system.
:::

## 4. Disconnection is normal, not exceptional

Version one treated a disconnect as an exception: clear that device's state and register it as a new device when it returns. The result was that switching networks once lost the result of a running task and the whole context on rejoin.

Treating recovery as a normal path made behaviour predictable: a device rejoins carrying its previous identity and the state of unfinished tasks, and the hub realigns both views before dispatching again. That is a different thing from "reconnect means start over".

::: tip Best value for effort
Before writing any dispatch logic, write down what each side knows and does not know when a device rejoins. Almost all the complexity of reconnection comes from that table being unstated, not from the protocol itself.
:::

## 5. Where it stands

- Three platforms: Android, Linux, Windows
- **176 tests passing**, covering protocol encoding, task dispatch, reconnection and permission checks
- Positioned as a working prototype, not a product — the README states plainly what works and what does not yet

## 6. Closing thought

The real gain was not the protocol but **applying distributed-systems constraints to a personal setup**: networks drop, devices restart, credentials expire, concurrency interferes. None of that shows up while an agent runs on a single machine — one step beyond it, all of it does.

## 7. Reusable checklist

- Choose topology by state-consistency cost first, performance second;
- Centralise state and authentication instead of having every device track every other;
- When code moves across devices: closed by default, per-device grants, verifiable provenance;
- Recovery is a normal path — do not clear context or re-register as a new device;
- Devices declare what they offer; scheduling decides the rest, and capabilities are not mirrored;
- At prototype stage, state plainly in the README what the system does and does not do.
