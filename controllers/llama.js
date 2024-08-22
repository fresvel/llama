import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: "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"//process.env['GROQ_API_KEY'], // This is the default and can be omitted
});

async function main() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `[

  {
    "Materia": "Programación Estructurada y Fu",
    "Docente": "POSLIGUA FLORES KLEBER ROLANDO",
    "N° matriculados": 19,
    "N° aprobados": 15,
    "Nota promedio del grupo": 32.26,
    "% superan el promedio": 47.37
  },
  {
    "Materia": "Estructuras Discretas",
    "Docente": "BUSTOS VERA RHAY PABLO",
    "N° matriculados": 17,
    "N° aprobados": 17,
    "Nota promedio del grupo": 42.76,
    "% superan el promedio": 47.06
  },
  {
    "Materia": "Calculo Diferencial e Integral",
    "Docente": "HIDALGO SOLORZANO LUIS ENRIQUE",
    "N° matriculados": 17,
    "N° aprobados": 13,
    "Nota promedio del grupo": 33.18,
    "% superan el promedio": 70.59
  },
  {
    "Materia": "Sistemas Electrónicos Digitales",
    "Docente": "NEVAREZ TOLEDO MANUEL ROGELIO",
    "N° matriculados": 17,
    "N° aprobados": 17,
    "Nota promedio del grupo": 42.29,
    "% superan el promedio": 47.06
  },
  {
    "Materia": "Contextos e Interculturalidad",
    "Docente": "MARQUEZ ARBOLEDA VIVIANA MERCEDES",
    "N° matriculados": 15,
    "N° aprobados": 15,
    "Nota promedio del grupo": 41.0,
    "% superan el promedio": 46.67
  },
  {
    "Materia": "Fundamentos de la Investigación",
    "Docente": "SAMANIEGO GARCIA ROSA PAOLA",
    "N° matriculados": 1,
    "N° aprobados": 1,
    "Nota promedio del grupo": 35.0,
    "% superan el promedio": 0.00
  },
  {
    "Materia": "Fundamentos de la Investigación",
    "Docente": "SAMANIEGO GARCIA ROSA PAOLA",
    "N° matriculados": 13,
    "N° aprobados": 13,
    "Nota promedio del grupo": 41.46,
    "% superan el promedio": 53.85
  },
  {
    "Materia": "Fundamentos de la Investigación",
    "Docente": "PALENCIA GUTIERREZ ESPERANZA MARBELLA",
    "N° matriculados": 1,
    "N° aprobados": 1,
    "Nota promedio del grupo": 41.0,
    "% superan el promedio": 0.00
  }
]

Los datos presentados corresponden a la información de rendimiento académico de los estudiantes de primer nivel de TICs. Cada materia tiene un número diferente de matriculados pero son los mismos estudiantes. Realiza un análisis del rendimiento del curso redactando de manera formal y en párrafos los resultados.` }],
    model: 'llama3-8b-8192',
    //model: 'llama3-8b-8192',
  });

  console.log(chatCompletion.choices[0].message.content);
}

main();