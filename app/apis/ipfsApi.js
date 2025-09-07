import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PinataSDK } = require("pinata")
const fs = require("fs")
const { Blob } = require("buffer")
require("dotenv").config()

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.IPFS_WRITE_JWT}`,
  pinataGateway: `${process.env.PUBLIC_GATEWAY_URL}`
})


{/* <input type="file" onChange={(e) => {
  const file = e.target.files?.[0]
  console.log(file) // already a File object!
}} /> */}

let CID = "";
export const upload = async(file) => {
  if (!file) {
			alert("No file selected");
			return;
		}
  try {
    const upload = await pinata.upload.public.file(file);
    CID = upload.cid;
    console.log(upload)
  } catch (error) {
    console.log(error)
  }
}

{/* <img src={fileUrl} alt="Uploaded file" /> */}


export const fetchFile = async(CID) => {
  try {
    const fileUrl = await pinata.gateways.public.convert(CID)
    console.log(fileUrl)
  } catch (error) {
    console.log(error);
  }
}

