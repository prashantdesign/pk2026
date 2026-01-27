'use server';

/**
 * @fileOverview AI-powered project description generator for the admin panel.
 *
 * - generateProjectDescription - A function to generate project descriptions based on project details.
 * - GenerateProjectDescriptionInput - The input type for the generateProjectDescription function.
 * - GenerateProjectDescriptionOutput - The return type for the generateProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateProjectDescriptionInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  category: z.string().describe('The category of the project (e.g., Branding, UI/UX).'),
  tools: z.string().describe('A comma-separated list of tools used in the project (e.g., Photoshop, Illustrator, Figma).'),
});
export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  shortCaption: z.string().describe('A short, one-sentence caption for the project.'),
  longCaseStudy: z.string().describe('A longer, more detailed case study description of the project.'),
  socialMediaVersion: z.string().describe('A version of the description optimized for social media.'),
});
export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;

export async function generateProjectDescription(input: GenerateProjectDescriptionInput): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const generateProjectDescriptionPrompt = ai.definePrompt({
  name: 'generateProjectDescriptionPrompt',
  input: {schema: GenerateProjectDescriptionInputSchema},
  output: {schema: GenerateProjectDescriptionOutputSchema},
  prompt: `You are a creative copywriter specializing in crafting compelling project descriptions for design portfolios.

  Given the following project details, generate a short caption, a longer case study description, and a social media version.

  Project Title: {{{projectTitle}}}
  Category: {{{category}}}
  Tools Used: {{{tools}}}

  Short Caption (1 sentence):
  Long Case Study Description:
  Social Media Version:
  `,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProjectDescriptionPrompt(input);
    return output!;
  }
);
