# Game of life!

This project requires [Bun](https://bun.sh/) to run!

## Scripts

To run the application locally in development, use the following command:

```bash
bun dev
```

The development server will be started and will be accessible form http://localhost:5173

To build the application, use the following command:

```bash
bun build
```

To test the application, use the following command:

```bash
bun test
```

Make sure you have Bun installed before running these commands.

## What's in this project
Required
- [x] Game simulation logic
- [x] Ability to play, pause, restart and clear
- [x] Ability to download and upload the game's state
- [x] Ablity to toggle cells with the mouse (needs to be improved)
- [x] Speed control
- [x] Unit tests
---
Nice-to-have
- [ ] Colorization
- [ ] Time Travel


## Some notes on the implementation

These are just some quick pointers about the way that this is implemented.

### Overview

This is an **React SPA**, nothing fancy about that. It access **2d Rendering Context** APIs through the canvas, and performs scene calculations using **WebWorkers** for performance reasons.

The data flow looks a little bit like this:

```
 UI  - user clicks on the buttons, draws on the canvas, etc.
 |
 |
 v
 Application State - calls methods exposed by the model classes
 |
 | (some methods have side-effects on the UI)
 |
 v
 React State - Updates the state of the UI, rerenders
```

### Application State

The way that the UI interfaces with the Application State is through the model classes:
- Engine - Handles rendering the data from the scene (cells)
- Scene - Keeps track of the cell states and calculates the next position (by using WebWorkers)

and model logic:
- gameplay - just some of the top-level game description and mechanics

The relation looks like this:
```
 Engine - starts the rendering loop
 |
 | (every frame, get scene information)
 |
 v
 Scene - calculates the scene information,
 |
 | (calculate the next state of all cells)
 |
 v
 WebWorker
 |
 | (determine the next state of cells
 |  based on the gameplay mechanics)
 v
 gameplay logic
```

## What's this is missing

There are a couple of things I think are missing in this implementation that I didn't have enough time (or motivation :P) for. Just the classic optimizations

### 1.Further optimization

This simulation starts to lag after the cell number increases past around 300x300 cells.
I tried optimizing this by having WebWorkers do the cell state calculation, but that only helped a little.

My guess is that the only other bottle-neck is the actual drawing of the frame. We go linearly pixel by pixel and create a `rect`. It will be more performant to create a dedicated **WebGL/WebGPU shader**, pass only information about the cells position, size and color and have the **GPU draw the boxes**.

It seemed as overkill at first, but now it seems it's necessary for real-time smooth simulations of that scale.

### 2. Responsive design

The fact that the maximum amount of cells one can have (as per the challange description) is 1000x1000 makes it difficult to show a canvas in screens smaller than that.

This is not a requirement (at least explicitly stated) in the challange description, but I guess would have been nice to have.

### 3. Colorization

This one is talked about in the challange description as a nice-to-have. Implementing the logic for colorizing the cell wouldn't have been too hard to implement, it would just have added some steps of calculation in the already "bottle-necked" scene calculation.
This step would be better off implemented after the moving to WebGL.

### 4. Time Travel

This one is talked about in the challange description as a nice-to-have.
I also don't think this would have been too complex to add, just a bit cumbersome.
My initial instict would be to store a scene snapshot every second in the `localStorage` and have some UI that allows for the user to go back to those.

The cumbersome part would be to handle weird states of it. E.g.:
- Make sure that when we clear the canvas, we clear the snapshots
- Handle pausing
- Handle mouse drawing on top of that
- Handle uploading from JSON file