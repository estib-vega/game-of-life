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
