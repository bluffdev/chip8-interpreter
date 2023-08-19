# 🕹️ CHIP-8 Interpreter

A CHIP-8 Interpreter written in Typescript for the Browser

## Background

I tried making one of these a few years ago after hearing that it was a good project for people interested in developing emulators. Long story short, I gave up after running into a couple of bugs I couldn't solve. I thought it would be fun to revisit this project again and make a web based version of it.

## Usage

You will need to have [Node.js](https://nodejs.org/en/) installed on your system. This application uses a frontend build tool called [Vite](https://vitejs.dev/) for development and production builds.

### Install

Clone this repository and install the dependencies.

```bash
git clone https://github.com/bluffdev/chip8-interpreter.git
cd chip8-interpreter
npm i
```

### Development

Run the application in development mode

```bash
npm run dev
```

### Build

Build the application for production in the `dist` directory and preview it

```bash
npm run build
npm run preview
```

## Resources

- http://devernay.free.fr/hacks/chip8/C8TECH10.HTM

- https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/

- https://en.wikipedia.org/wiki/CHIP-8

- https://github.com/leandrogaspar/chip8
