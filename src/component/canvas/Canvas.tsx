import React, {RefObject} from 'react';


interface CanvasOptions {
    context: string,
    canvasWidth?: number,
    canvasHeight?: number
}

interface CanvasProps {
    options: CanvasOptions,
    canvasRef: RefObject<HTMLCanvasElement>
}

const Canvas = (props: CanvasProps) => {
    const { options, canvasRef } = props;
    const { canvasWidth, canvasHeight } = options;


    return <canvas
      style={{border: '1px solid black'}}
        ref={ canvasRef }
        width={ canvasWidth }
        height={ canvasHeight }
    />
}

export default Canvas;
