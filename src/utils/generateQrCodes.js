import { supabase } from "@/lib/supabase";
import { pdf, Document, Page, View, Image, Text } from "@react-pdf/renderer";
import cuid from "cuid";
import QRCodeGenerator from "qrcode";


export default async function generateQrCodes(quantity, eventId, store_domain){

  let qrInstanceLog = [...Array(parseInt(quantity)).keys()].map(()=>{
    return cuid()
  })

    const qrLinks = await Promise.all(qrInstanceLog.map((qrInstanceId)=>{
      return QRCodeGenerator.toDataURL(`https://${'the-honey-shop-2.myshopify.com'}/giveaways?qr=${qrInstanceId}`)
    }))


    const MyDoc = (
        <Document>
          <Page style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {qrLinks.map((qrLink, index)=>{
              console.log(qrLink)
                return (
            <View style={{ padding: 10 }} key={index}>
              <Image src={qrLink} style={{ width: 100, height: 100 }} />
            </View>)
              }
            )}
          </Page>
        </Document>
      );
    
// const registrationResult = await registerQrInstances(qrInstanceLog,eventId)
// if(registrationResult.status=='failed'){
//   console.log("couldn't register..",registrationResult.error)
//   return;
// }

      const pdfBlob = await pdf(MyDoc).toBlob();
    
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.target = '_blank'
      // link.download = "example.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
}

async function registerQrInstances(log, eventId){
const {error} = await supabase.from("qr-instance").insert(log.map((qrInstance)=>{
return {
    "instance_id" : qrInstance,
    "availed_status" : false,
    "event_id":eventId
}
}))

if(error)return {status:'falied',error}

return{status:'success'}
}