const deepai = require('deepai');
const { NSFWKEY } = require('../../config/botconfig.json');
deepai.setApiKey(NSFWKEY);

module.exports = isNsfw

async function isNsfw (url){
  try {
      var response = await deepai.callStandardApi("nsfw-detector", { image: url});
    } catch (e) {
      console.log(e)
    }

    if (response){
      var detect = response.output.detections
      var exposed = false
      var nsfw = false
      detect.forEach(function (d) {
        var name = d.name
        var confidence = parseFloat(d.confidence)

        if(name.includes("Exposed") && confidence > 0.4){
          exposed = true
        }
      })

      if (exposed || response.output.nsfw_score > 0.4) nsfw = true

      return nsfw
    }
  return false
}
