"use client"

import { supabase } from "@/lib/supabase";
import { pdf, Document, Page, View, Image, Text } from "@react-pdf/renderer";
import cuid from "cuid";
import QRCodeGenerator from "qrcode";


export default async function generateQrCodes(quantity, store_domain, duration, created_by){

  let qrInstanceLog = [...Array(parseInt(quantity)).keys()].map(()=>{
    return cuid()
  })

    const qrLinks = await Promise.all(qrInstanceLog.map((qrInstanceId)=>{
      return QRCodeGenerator.toDataURL(`https://${store_domain}/giveaway?qr=${qrInstanceId}`)
    }))


    const MyDoc = (
        <Document>
          <Page style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {qrLinks.map((qrLink, index)=>{
                return (
            <View style={{ padding: 10 }} key={index}>
              <Image alt={'qr'} src={qrLink} style={{ width: 100, height: 100 }} />
            </View>)
              }
            )}
          </Page>
        </Document>
      );
    
const registrationResult = await registerQrInstances(qrInstanceLog,duration, created_by)
if(registrationResult.status=='failed'){
  console.log("couldn't register..",registrationResult.error)
  return;
}

      const pdfBlob = await pdf(MyDoc).toBlob();
    
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.target = '_blank'
      // link.download = "example.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
}

async function registerQrInstances(log, duration, created_by){
  console.log(duration.startDate && duration.startTime ? new Date(`${duration.startDate}T${duration.startTime}`).getTime() : null)
const {error} = await supabase.from("qr_instance").insert(log.map((qrInstance)=>{
return {
    "instance_id" : qrInstance,
    "end": duration.endDate && duration.endTime ? new Date(`${duration.endDate}T${duration.endTime}`).getTime() : null,
    "created_by": created_by //tobe updated
}
}))

if(error)return {status:'falied',error}

return{status:'success'}
}