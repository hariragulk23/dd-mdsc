# Translation notes (English phase 2a)

Terms and choices I was unsure about. Please review before publishing. Nothing here is a legal translation.

## Legal and factual claims to check (about-us, services)
- **Company details** (about-us): "THE COFFEE PROJECT OF 69 SL", "single-member limited company" (sociedad limitada unipersonal), "tax ID (NIF) B19853563", registered address, "Alicante Commercial Registry" (Registro Mercantil de Alicante), "sheet A-192887" (hoja). The company name is not translated; the legal form words are my translation. Decision: "marca comercial" is now "**a brand of**" THE COFFEE PROJECT OF 69 SL (was "a trade name of").
- **"We do not have a physical shop open to the public"** (about-us), translated as it is in Spanish. Decision: "La marca se dirige a Madrid y a toda España" is now "The brand is **aimed at** Madrid and the whole of Spain" (was "serves").
- **Online shop** (about-us). Decision: the six-coffee line is gone. The list item now reads "**Online shop: coming soon.**" and the meta, og and twitter descriptions say "an online shop coming soon". No English page mentions six coffees or delivery to mainland Spain any more. The intro line "We bring together guides, services for coffee businesses and an online shop." still names the shop without "coming soon"; I left it as the Spanish page has it.
- **Services FAQ**: "We serve clients in Madrid and all over Spain" and "Advice, supply and some courses can also be done in other cities." Same claims as the Spanish page.
- **Certificate** (services FAQ, text and JSON-LD). Decision: the answer is now "**Once the courses start, you will receive a certificate of attendance.** For official SCA certifications we advise you on where to get them." This is not a literal translation of the Spanish: it adds "Once the courses start" because the course is "Coming soon".
- **"Tasting (cupping) with the SCA protocol"** (course list). Decision: "(cupping)" added to the Spanish "Cata con el protocolo de la SCA".
- **Quotes** (services). Decision: "Precio bajo presupuesto" is now "**Price on request**" in both services (green coffee and roasted coffee). "fixed quote" (presupuesto cerrado) and "Quote based on number of guests" are unchanged. No amounts, dates or promises were added.
- **Counter figures** (history): 2,215 branded cafés, €1,925M, 60%, 12.5%, 80%, McCafé 539 / Starbucks 181 / Santagloria 165. Numbers and sources are copied from the Spanish page.
- **"€1,925M"**: the Spanish page says "1.925 M€". I wrote "€1,925M" (symbol first, as in the style guide). To animate the euro sign on the English page I added an optional `data-prefix` attribute to the counter script. Spanish counters have no prefix, so they are unchanged.

## Terms I translated without a glossary entry
- **Gotero** (V60, dripper): "dripper". Decision: the phase-1 cost article FAQ now also says "a scale, a grinder and a dripper" (it said "kettle"), in the visible text and in the FAQPage JSON-LD. The remaining "kettle" uses are the "hervidor" in the how-to-start article (hero image alt, also reused on the English landing page and journal, and "a kettle with temperature control").
- **Molinillo de muelas**: "burr grinder"; **de cuchillas**: "blade grinder".
- **Torrefacto**: kept as "torrefacto" and explained in the text ("coffee roasted with sugar added at the end").
- **Sin comprarte media cocina**: "without buying half a kitchen" (title of the how-to-start article). A literal calque; a more natural option could be "without buying half the shop".
- **Pruébalo / Ojo / Dato** callout tags: "Try it" / "Watch out" / "Fact" (the last two as in phase 1).
- **Guías y consejos**: "Guides and tips". **Historia y orígenes**: "History and origins". Neither is in the glossary.
- **Prensa francesa**: "French press".
- **Tertulia**: "a place for conversation".
- **Festival Español del Café 2015**: "Festival Español del Café (Spanish Coffee Festival), 2015" (decision; I added a comma after 2015 so the sentence still reads: "...and the Festival Español del Café (Spanish Coffee Festival), 2015, is announced"). **Campeonato Nacional de AeroPress**: "National AeroPress Championship (Spain)" (decision).
- **Toma Café, calle de la Palma**: "Toma Café, Calle de la Palma".
- **Cafeterías de marca**: "branded cafés" (as in "branded outlets" in the FAQ).
- **En tiendas** (60% counter): "in retail shops" (decision, was "in shops").
- **Guerra Civil**: "the **Spanish** Civil War" (decision). **Posguerra**: "post-war".
- **Asesoría / Pedir asesoría**: "advice" / "Ask for advice" (phase 1, menu button).
- **Pedir información (de fechas)**: "Ask for information" / "Ask about dates". All service buttons point to the Spanish contact form, so they carry "(Spanish)".
- **Acompañamiento** (how we work, step 4): "Support".
- **Barra de café para eventos**: "Coffee bar for events". **Asesoría de origen**: "Origin advice". **Formación en métodos de preparación**: "Training in brewing methods".
- **Abrir tu cafetería de especialidad**: "Open your specialty café".
- **Calcula tu receta** (quiz result buttons): "Work out your recipe (Spanish)".
- **Ilustración / Imagen generada por IA**: "AI-generated illustration" / "AI-generated image".

## Structure choices
- Services page: the anchor ids are now English (`open-a-cafe`, `create-your-brand`, `green-coffee`, `roasted-coffee`, `roasting-course-tastings`, `brewing-training`, `origin-advice`, `events`). The footer links on every English page use these. The Spanish page keeps its Spanish ids.
- The small label under each service ("For entrepreneurs", etc.) is "For …" as in "Para …".
- The about-us footer has no contact call-to-action block, exactly like the Spanish about-us page.
- The "Brewing guides", "Guides", "Specialty coffee", contact, legal and shop links still go to Spanish pages and carry "(Spanish)".
- Journal cards for the two older articles show only the category, title, hook, read time and date (no feature chips), like the three phase-1 cards.
