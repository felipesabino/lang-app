import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Story } from "./model/story-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3client = new S3Client({});

export const handler = async (event: Record<string, AttributeValue>): Promise<{metadata: Story}> => {
  const metadata = unmarshall(event) as Story;

  const BUCKET_NAME = process.env.TEXT_BUCKET_NAME;
  const KEY = `${metadata.storyId}/text.txt`;

  const text = `Era una calda giornata d'estate, e Maria e i suoi amici stavano seduti fuori da un caffè a Roma, discutendo i loro piani per il futuro. Tutti erano fluenti in diverse lingue, ma c'era una lingua che li aveva colpiti da un po 'di tempo: l'italiano.

  "Ho sentito che l'italiano è una lingua bellissima", ha detto Maria. "Ho sempre voluto impararlo". I suoi amici annuirono in accordo.

  E così, il gruppo di amici decise di prendere lezioni di italiano insieme. Si iscrissero a un corso in una scuola di lingue locale e presto si trovarono completamente immersi nella lingua.

  All'inizio, le regole grammaticali sembravano travolgenti. I plurali, gli accordi di genere e le coniugazioni dei verbi erano tutti concetti nuovi per loro. Ma continuando a frequentare le lezioni e a parlare con i loro compagni di classe, cominciarono a vedere come tutto combaciasse.

  Erano affascinati dal modo in cui l'italiano veniva usato per esprimere emozioni e idee. Impararono a usare il congiuntivo per esprimere dubbi e incertezze e scoprirono la bellezza del tempo imperfetto, che viene utilizzato per descrivere azioni nel passato.

  Continuando le loro lezioni, iniziarono a notare la lingua italiana ovunque andassero. La sentivano parlare per strada, nei caffè e alla radio. Iniziarono a capire canzoni e film in italiano e furono persino in grado di avere conversazioni di base con i locali.

  Un giorno, camminando per le strade storiche di Roma, incontrarono un gruppo di bambini italiani che stavano giocando. Si avvicinarono ai bambini e iniziarono a parlare con loro in italiano. I bambini erano sorpresi e felici di sentirli parlare la loro lingua e diventarono amici subito.

  Il gruppo di amici era entusiasta del loro progresso e non riusciva a credere quanto divertente fosse imparare la lingua italiana. Iniziarono a pianificare viaggi in altre parti d'Italia, ansiosi di praticare le loro nuove abilità linguistiche.

  E così, il loro viaggio con la lingua italiana continuò. Impararono sempre di più ogni giorno e scoprirono un nuovo mondo di cultura, arte e storia. Realizzarono che imparare una nuova lingua non era solo un modo per comunicare con gli altri, ma anche un modo per connettersi con una cultura e vedere il mondo sotto una luce diversa.

  Alla fine, Maria e i suoi amici non potevano immaginare un modo migliore per trascorrere l'estate. Avevano imparato una nuova lingua, fatto nuovi amici e scoperto un nuovo mondo. E tutti concordavano sul fatto che imparare l'italiano fosse una delle esperienze più piacevoli e gratificanti della loro vita.`

  await s3client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: KEY,
    Body: text,
    ContentType: 'text/plain',
    Metadata: {
      'x-amz-meta-storyId': metadata.storyId,
      'x-amz-meta-generationRequestDate': metadata.generationRequestDate + '',
      'x-amz-meta-gramarOptions': metadata.creationMetadata.gramarOptions.join('|'),
      'x-amz-meta-language-source': metadata.creationMetadata.language.source,
      'x-amz-meta-language-target': metadata.creationMetadata.language.target,
      'x-amz-meta-theme': metadata.creationMetadata.theme,
      'x-amz-meta-narrationStyle': metadata.creationMetadata.narrationStyle,
      'x-amz-meta-specificWords': metadata.creationMetadata.specificWords.join('|'),
    }
  }));

  return { metadata };
}