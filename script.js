let creditscore=72;
let classification="suspicious"
let phrase ="Shocking discovery"

function Analyse(){
      const credscore=document.querySelector(".score")
      credscore.insertAdjacentHTML("beforeend",` ${creditscore}`)
      const credvalue=document.querySelector(".credvalue")
      credvalue.insertAdjacentHTML("beforeend",`<p>Credibility value is ${classification}</p>`)
        const phrasestat=document.querySelector(".phrase")
      phrasestat.insertAdjacentHTML("beforeend",`<p>Highlighted Phrases are ${phrase}</p>`)
      let analyze=document.querySelector(".analysebtn")
      analyze.disabled=true
}
