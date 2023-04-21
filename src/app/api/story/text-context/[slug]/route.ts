import { NextResponse } from 'next/server';
import { getAnswer } from './openai';

export interface TextContext {
  text: string;
  explanation: string;
}

export async function GET(request: Request, context: { params:  { slug: string  }}) {
  // const aiResponse = await getAnswer(context.params.slug, "Italian", "English");
  // return NextResponse.json({
  //   text: context.params.slug,
  //   explanation: aiResponse,
  // });

  return NextResponse.json({
    text: context.params.slug,
    explanation: `Explanation:

    The sentence you are trying to learn means "They learned to use the subjunctive to express doubts and uncertainties." The subjunctive is a mood used in Italian to express hypothetical or uncertain situations, doubts, emotions, and desires. It is often used after certain conjunctions, verbs, and expressions that trigger the subjunctive.

    Examples:

    "È importante che tu venga alla festa." (It's important that you come to the party.)
    "Non credo che loro abbiano capito la lezione." (I don't think they understood the lesson.)
    "Spero che tu abbia successo nel tuo esame." (I hope you succeed in your exam.)
    "Se fossi in te, prenderei l'aereo invece del treno." (If I were you, I would take the plane instead of the train.)
    "È possibile che piova domani." (It's possible that it will rain tomorrow.)`,
  });

}
