# WeftMesh: every device is a complete agent

> September 2026. The starting point was an everyday annoyance: I run agents on a laptop, a server, a NAS and a phone, and they are all isolated — each needs its own configuration, its own credentials, its own progress checking, and coordination between them means moving things by hand.

## The goal in one sentence

**Every device is a complete agent, and devices can borrow each other's environments.** When a session on the laptop needs the GPU on the server, the task is handed to the other device and the result returns to the original session.

## Structure: star topology with a purpose-built protocol

The topology is a star rather than a full mesh: one device acts as the hub and the others join it. State and authentication then live in one place instead of every device tracking its relationship with every other — devices can come and go without pairwise bookkeeping.

The device protocol handles three things: capability advertisement (what this device offers — GPU, storage, installed tools), task dispatch and result return, and state recovery after disconnection.

## Where it stands

- Three platforms: Android, Linux, Windows
- **176 tests passing**, covering protocol encoding, task dispatch, reconnection and permission checks
- Positioned as a working prototype, not a product — the README states plainly what works and what does not yet

## Questions worth settling first

**Permission boundaries**: devices borrowing each other's environments means executable code moves between them, so task provenance must be verifiable and capability sharing must be opt-in per device.

**Disconnection is normal**: phones switch networks, servers restart. The protocol treats recovery as a normal path rather than an exception.

**Do not mirror everything**: rather than replicating every capability everywhere, each device declares what it offers and the hub schedules.

## Closing thought

The real gain was not the protocol but **applying distributed-systems constraints to a personal setup**: networks drop, devices restart, credentials expire, concurrency interferes. None of that shows up while an agent runs on a single machine — one step beyond it, all of it does.
