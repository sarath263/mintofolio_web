
import { useEffect } from "react";
import init, { render_from_base64 } from "./wasm_image_render.js";
import { getImageByFilename } from "../api.js";

export const renderImage = async (id, base64) => {
  await init();
  render_from_base64(id, base64, 1);

};
export const ImageCanvas = ({ im }) => {
 useEffect(()=>{
  if(im){
    getImageByFilename(im).then((image)=>{
      if (image && image?.data?.base64Data) {
        renderImage(im || "pbg", image?.data?.base64Data);
      }
    })
  }
 })
  return (<div className="relative w-full h-full overflow-hidden ">
    <canvas id={im || "pbg"} className="absolute inset-0 w-full h-full object-cover" />
  </div>);

}