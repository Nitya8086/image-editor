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
        height: 400
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


    const addText = () => {
        if (!canvas || !caption.trim()) return;

        const text = new fabric.Textbox(caption, {
            left: canvas.width / 2 - 50,
            top: canvas.height / 2 - 20,
            fontSize: 20,
            fill: 'black',
            fontWeight: 'bold',
            editable: true
        });

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
            default: return;
        }
        canvas.add(newShape);
        canvas.renderAll();
    };

    const downloadImage = () => {
        if (!canvas) return;

        const background = canvas.backgroundImage;
        if (background) {
            canvas.setBackgroundImage(background, canvas.renderAll.bind(canvas), {
                crossOrigin: 'anonymous'
            });
        }

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
            <h1 className="title">Add Caption Page</h1>
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
                    <button className="download-btn" onClick={downloadImage}>Download</button>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
