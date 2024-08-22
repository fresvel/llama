import Groq from 'groq-sdk';
import csvtojson from 'csvtojson';
import fs from 'fs';
const csvFile = 'Reporte.csv';
const csvobj = {};

export const import_grades= async(req, res)=>{
    csvtojson({delimiter: ";" })
    .fromFile(csvFile)
    .subscribe((jsonLine, index) => {
        csvobj[index] = jsonLine;
      })
    .then(async ()=>{

        let nrcs=Object.values(csvobj).map(linea => linea.NRC);
        let levels=Object.values(csvobj).map(linea => linea.NIVEL);

        nrcs = [...new Set(nrcs)];
        levels = [...new Set(levels)];
        console.log(levels);     
        
        const notas={}
        const info_nrc={}

        nrcs.forEach(nrc=>{
          notas[nrc] =[]
          info_nrc[nrc] ={}
        })

        nrcs.forEach(nrc=>{
          for(let key in csvobj){
            if(nrc==csvobj[key].NRC){
              info_nrc[nrc].Asignatura=csvobj[key].titulo_curso
              delete(csvobj[key].titulo_curso)
              info_nrc[nrc].Docente=csvobj[key].nombres_completos_docente
              delete(csvobj[key].nombres_completos_docente)
              info_nrc[nrc].Semestre=csvobj[key].NIVEL
              delete(csvobj[key].NIVEL)
              //delete(csvobj[key].NRC)
              info_nrc[nrc].nrc=csvobj[key].NRC
              notas[nrc].push(csvobj[key])
              delete(csvobj[key])
            }
          }
        });



        
        for( let nrc in notas){
          info_nrc[nrc]["Aprobados"]=0
          info_nrc[nrc]["Calificación_promedio"]=0
          info_nrc[nrc]["Porcentaje_supera_promedio"]=0
          info_nrc[nrc].Total_estudiantes=notas[nrc].length

          notas[nrc].forEach(reg=>{
            info_nrc[nrc]["Calificación_promedio"]+=Number(reg.nota_final)
            if(reg.estado==="APROBADO"){
              info_nrc[nrc]["Aprobados"]++
            }
          })
          info_nrc[nrc]["Calificación_promedio"] =Number((info_nrc[nrc]["Calificación_promedio"]/info_nrc[nrc].Total_estudiantes).toFixed(2))

          notas[nrc].forEach(reg=>{
            if (Number(reg.nota_final)>info_nrc[nrc].Calificación_promedio){
              info_nrc[nrc]["Porcentaje_supera_promedio"]++;
            }
          })
          info_nrc[nrc].Porcentaje_supera_promedio=`${(100*(info_nrc[nrc].Porcentaje_supera_promedio/info_nrc[nrc].Total_estudiantes)).toFixed(2)}`;

          //console.log(info_nrc)

        }

        const info_level={}
        levels.forEach(level=>{
            info_level[level] =[]
        })
        console.log(info_level)
        for(let nrc in info_nrc){

            for (let level in levels){
                if(Number(info_nrc[nrc].Semestre)==Number(levels[level])){
                    console.log("OK")
                    console.log(info_level[levels[level]])
                    info_level[levels[level]].push(info_nrc[nrc])
                    break;
                }else{
                    console.log(`nrc: ${info_nrc[nrc].nivel}|${levels[level]}`)
                }
                
            }
        }

        console.log(info_level)
        
        
        let latexfile="";
        for (const clave in info_level) {
          console.log(`La clave es ${clave}`)
          latexfile= latexfile+createTable(info_level[clave])
          const llama=await getllama_analisis(info_level[clave])
          let analisis=`\n\\vspace{1cm}\n\\section{Análisis de Rendimiento}\n${llama}\\\\\n\\vspace{1cm}`
          latexfile=latexfile+analisis
        }


        const filePath="Latex/Contenido/1.- Contenido.tex"
        saveLatexFile(filePath, latexfile);
        
        res.json({info_level, latexfile})
        
    })
}



const groq = new Groq({
  apiKey: "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"//process.env['GROQ_API_KEY'], // This is the default and can be omitted
});

const  getllama_analisis=async(notas)=> {
  console.log(notas);
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `${notas}
      Los datos presentados corresponden a la información de rendimiento académico de los estudiantes de primer nivel de TICs. Cada materia tiene un número diferente de matriculados pero son los mismos estudiantes. Realiza un análisis del rendimiento del curso redactando de manera formal y en párrafos los resultados en español.` }],
    model: 'llama3-8b-8192',
  });

  console.log(chatCompletion.choices[0].message.content);
  return chatCompletion.choices[0].message.content
}



const createTable = (promedios) => { //Recibe un objeto con los Json de las calificaciones

  let latexTable = `\\small\n\\begin{tabularx}{\\textwidth}{|p{2.5cm}|p{2.5cm}|X|X|X|X|}\n\\hline\n`;
  latexTable += `\\textbf{Materia} & \\textbf{Docente} & \\textbf{Estudiantes} & \\textbf{Aprobados} & \\textbf{Promedio} & \\textbf{\\%Supera el Promedio} \\\\ \\hline\n`;

  promedios.forEach(item => {
    latexTable += `${item.Asignatura} & ${item.Docente} & ${item.Total_estudiantes} & ${item.Aprobados} & ${item.Calificación_promedio} & ${item.Porcentaje_supera_promedio} \\%\\\\ \\hline\n`;
  });

  latexTable += `\\end{tabularx}\n`;

  return latexTable;

}


const saveLatexFile=(filePath, content)=> {
  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
      return;
    }
    console.log('Archivo LaTeX guardado correctamente.');
  });
}