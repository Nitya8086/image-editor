import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useLocation } from 'react-router-dom';
import './EditPage.css';

const EditPage = () => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [caption, setCaption] = useState("");
    const location = useLocation();
    const imageUrl = location.state?.imageUrl;

    useEffect(() => {
        if (!imageUrl) return;

        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 400,
            selection: true,
        });

        const imgElement = new Image();
        imgElement.crossOrigin = 'anonymous';
        imgElement.src = imageUrl;

        imgElement.onload = () => {
            const imgInstance = new fabric.Image(imgElement, {
                scaleX: 500 / imgElement.width,
                scaleY: 300 / imgElement.height,
                left: (fabricCanvas.width - 500) / 2,
                top: (fabricCanvas.height - 300) / 2,
                selectable: false
            });

            fabricCanvas.setBackgroundImage(imgInstance, fabricCanvas.renderAll.bind(fabricCanvas));
            setCanvas(fabricCanvas);
        };

        return () => fabricCanvas.dispose();
    }, [imageUrl]);

    const addDeleteControl = (object) => {
        object.hasControls = true;
        object.cornerStyle = 'circle';
        object.cornerColor = 'red';
        object.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -10,
            offsetX: 10,
            cursorStyle: 'pointer',
            render: (ctx, left, top) => {
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(left, top, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.fillText('X', left - 3, top + 3);
            },
            mouseUpHandler: (eventData, transform) => {
                const target = transform.target;
                canvas.remove(target);
                canvas.renderAll();
            }
        });
    };

    const addText = () => {
        if (!canvas || !caption.trim()) return;

        const text = new fabric.Textbox(caption, {
            left: canvas.width / 2 - 50,
            top: canvas.height / 2 - 20,
            fontSize: 20,
            fill: 'black',
            fontWeight: 'bold',
            editable: true,
        });

        addDeleteControl(text);
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        setCaption("");
    };

    const addShape = (shape) => {
        if (!canvas) return;
        let newShape;
        
        switch (shape) {
            case 'circle':
                newShape = new fabric.Circle({ radius: 30, fill: 'red', left: 100, top: 100 });
                break;
            case 'rectangle':
                newShape = new fabric.Rect({ width: 100, height: 50, fill: 'blue', left: 150, top: 150 });
                break;
            case 'triangle':
                newShape = new fabric.Triangle({ width: 60, height: 60, fill: 'green', left: 200, top: 200 });
                break;
            case 'polygon':
                newShape = new fabric.Polygon([
                    { x: 50, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }
                ], { fill: 'purple', left: 250, top: 250 });
                break;
            default:
                return;
        }

        addDeleteControl(newShape);
        canvas.add(newShape);
        canvas.setActiveObject(newShape);
        canvas.renderAll();
    };

    const downloadImage = () => {
        if (!canvas) return;

        try {
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1.0,
                enableRetinaScaling: false,
                multiplier: 2
            });

            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'edited-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export canvas:", error);
            alert("Error exporting image. Make sure the image source supports CORS.");
        }
    };

    return (
        <div className="edit-container">
            <h1 className="title">Add Caption & Shapes</h1>
            <div className="edit-content">
                <div className="canvas-container">
                    <canvas ref={canvasRef} width={600} height={400}></canvas>
                </div>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Enter caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <button onClick={addText}>Add Caption</button>
                    <button onClick={() => addShape('circle')}>Add Circle</button>
                    <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
                    <button onClick={() => addShape('triangle')}>Add Triangle</button>
                    <button onClick={() => addShape('polygon')}>Add Polygon</button>
                    <button className="download-btn" onClick={downloadImage}>Download</button>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
