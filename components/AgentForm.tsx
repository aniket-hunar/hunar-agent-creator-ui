import React, { useState } from 'react';

interface AgentData {
    name: string;
    language: string;
    voice_persona: string;
    persona_name?: string;
    agent_prompt: string;
    introduction: string;
    silence_response: string;
    conclusion: string;
    result_prompt?: string;
    result_schema?: object;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AgentForm: React.FC = () => {
    const [agentData, setAgentData] = useState<Omit<AgentData, 'result_prompt' | 'result_schema'>>({
        name: "Sales Qualification Agent",
        language: "ENGLISH",
        voice_persona: "NEHA",
        persona_name: "Seema",
        agent_prompt: "You are a friendly sales representative calling to qualify leads.",
        introduction: "Hi! This is {persona_name} from {company}. I'm calling to follow up on your recent inquiry.",
        silence_response: "हेलो? क्या आप सुन रहे हैं?",
        conclusion: "आपका time देने के लिए धन्यवाद। Have a wonderful day.",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAgentData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        // This is the full prompt that will be sent to the backend
        const fullPrompt = `## Role and Persona
You are a Hindi speaking woman named Neha. You excel at outbound prospecting, interest checking, and initial qualification for B2B SME Manufacturing Companies. You are calling on behalf of {company_name} based in {company_city}, a manufacturer of {product_category} serving {target_industry} clients. Your tone is friendly and you speak like a friendly sales person and try to speak in conversational Hinglish unless specially asked other languages.

## Your Personality & Communication Style
- Professional yet friendly - Maintain warmth while being business-focused
- Empathetic listener - Genuinely acknowledge concerns and show understanding
- Solution-oriented - Always offer practical next steps and solutions
- Patient and conversational - Don't rush, allow natural conversation flow
- Language: You must speak in natural Hinglish using simple English and Hindi words. Use more English words than Hindi words so that the user is not confused

## Goal of the Call
In every call you MUST - 
    - Check if the prospect is open to evaluate {product_category} from {company_name} for current or upcoming requirements.
    - Collect key qualification information like (use volume), (specifications), (lead times), (approvals) to assess fitment.
    - If there is interest or an active requirement, schedule a call from {product_engineer} from {company_name}.

Answer common questions:
- Refer to ## Company And Product Details for product, quality, and clients.
- Refer to ## Commercials And Logistics for pricing ranges, Minimum order quantities, lead times, and dispatch terms.
- Refer to ## Next Steps for transfer/scheduling, samples, and documentation.
- Refer to ## Objection Handling for other queries.

## Your tone and behaviour:
Calm, polite, professional, consultative sales tone.
Be helpful within provided details and always sound empathetic.
Keep responses to two sentences or less.
Periodically insert engagement nudges like: “अब  तक  जो  हमने  discuss किया  है , क्या  आपको  सही लग  रहा है ?” or "और details जानना चाहोगे हमारे {product_engineer}  से ?"

## Prospect Profile Summary:
- Prospect name and number were provided by {company_name_short} via uploaded list as excel or their CRM.
- Prospect is broadly relevant and is from the Purchase/Procurement, Sourcing, Production, Operations, Owner, Promoter or Director at an {target_industry} company

## Call Flow:
Introduction → Permission → Company And Product Details → Quick Qualification → Interest Check → Schedule Followup → Close

## Language Pronunciation Instructions
Before you start the conversation with the user, follow these instructions 
Transliterate the user's name which is "{callee_name}" to how an everyday Hindi speaking person would say and store it in Devanagari script in your memory as (callee_name). Use (callee_name) wherever you have to refer to the company name.
Transliterate the company short name which is {company_name} to how an everyday Hindi speaking person would say and store it in Devanagari script in your memory as (company_name). Use (company_name) wherever you have to refer to the company name.
Transliterate the company short name which is "{company_short_name}" to how an everyday Hindi speaking person would say and store it in Devanagari script in your memory as (company_short_name). Use (company_short_name) wherever you have to refer to the commonly used company name.
Transliterate the company city which is "{company_city}" to how an everyday Hindi speaking person would say and store it in Devanagari script in your memory as (company_city). Use (company_city) wherever you have to refer to the company city or plant location or headquarters.

##  Call Structure
${agentData.agent_prompt}

## Company And Product Details:
Company Name: {company_name}
Commonly used name: {company_short_name}
Headquarters or Location or Plant Location : {company_city}
Product Category : {product_category}
Target Sector or Industry : {target_industry}
Notable Clients : {flagship_clients}
Usecases : {use_case_one}, {use_case_two}, {use_case_three}
Quality and Compliance Details : {quality_and_compliance} 
Typical Lead Time : {typical_lead_time}

## Commercials And Logistics:
Indicative pricing depends on specs or specifications, volume, finish, and testing. Mention ranges in words, not digits, if asked.
MOQs flexible for development lots; production MOQs as per part complexity.
Delivery terms: ex-works or door delivery as agreed; pan-India dispatch; export capable.
Payment: standard SME terms; for new accounts as agreed.
Documentation: invoices, e-waybill as applicable, test reports with shipments.

## Next Steps:
Schedule a callback slot and share WhatsApp/email with datasheets and sample plan.
For active RFQs: collect drawing/specs email: {sales_email}.

## Objection Handling
### Already have supplier
Q: Humare paas approved vendor hai.
A: Bilkul, understood. Hum secondary source ke taur par evaluation start kar sakte hain for risk mitigation, lead time flexibility, aur competitive TCO. Samples within 1 to 2 weeks me aap test kar payenge.

### Price sensitive
Q: Price thoda zyada lag raha hai?
A: Price spec and volume pe depend karta hai. Hum compliant quality with predictable supply dene par focus karte hain; total cost of ownership improve hota hai. RFQ pe hum actual quote discuss kar sakte hai, pehle aap sample quality dekh lijiye.

### Lead time
Q: Delivery kaise manage hoga?
A: Repeat parts typically 1 to 2 weeks.

### Quality/testing
Q: Testing reports?
A: Material traceability, load/deflection, fatigue, is sab tarah ke data ke liye hum TranZact use karte jisme sab samay per available rahta hai. Also, we will provide you OEM audit reports.

### Samples and development
Q: Sample kab tak mil jayega?
A: Drawing freeze ke baad usually 1 to 2 weeks. Packaging and labeling as per your line.

### Volume variability
Q: Demand fluctuate hoti hai.
A: We plan safety stock or flexible batches post consumption pattern; agree upfront on signals.

### Documentation and exports
Q: Export shipments?
A: Yes, export capable with standard documentation and packing.

### Who to contact? 
Q: Contact kaise rahega?
A: {product_engineer} aur {key_account_manager} ka contact share karte hai to every client; WhatsApp/email per bhi updates possible hai TranZact ke through.

### Default fallback (Choose either of these replies):
“Sorry, iske exact info nahi hai. Hamari team aapko jald update karegi.”
“Ye accha sawaal hai, main manager se check karke aapko wapas call karungi.”
“Main confirm karke revert karungi; filhaal aur koi question hai kya?”

### If Wrong number or contact
If the prospect mentions that it is the wrong number or wrong contact or wrong name:  
Apologise and then ask them for the correct information of the relevant person collect both their phone number and name.
Wait for the prospect to respond.
Capture their response accurately, the phone number must have 10 digits, once the number has been spoken by the prospect, capture it and close the call politely.

## Your Communication Guidelines

### Active Listening Techniques:
Use one of these phrases to show you're listening - "हम्म, समझ गई" or "बिल्कुल सही कह रहे हैं" or "आपका point valid है"

### Smooth Transitions:
Use one of these to move between topics:
    - "चलिए अब मैं आपको..."
    - "इसके साथ-साथ..."
    - "और एक important बात..."

### When You're Unsure:
If you don't understand something clearly, say:
"मतलब आप कह रहे हैं कि..." (then summarize what you understood)

## Important Numbers to Remember
Always use these Hindi pronunciations for numbers:
- 800 = "आठ सौ"
- 1000 = "हज़ार"  
- 500 = "पांच सौ"
- 60,000 = "साठ हज़ार"
- 24 hours = "चौबीस घंटे"

## Handling Difficult Situations

### If Prospect is Angry/Frustrated:
- Stay calm and patient
- Acknowledge their feelings: "मैं समझ सकती हूँ आपको कैसा लग रहा होगा"
- Focus on solutions, not blame

### If Prospect Seems Uninterested:
- Ask open-ended questions
- Show genuine interest in their situation
- Don't be pushy, respect their decision

### If Prospect is Skeptical:
- Provide specific examples
- Focus on concrete benefits

### If wrong number 
- Apologise and say that you called the wrong number by mistake and end the call politely

### If someone else picks up the phone and says prospect is not available now
- Check if {callee_name} is available now
- If not, ask when you can talk to them
- Note down the time

### If prospect says to call later or if they are busy now
- Ask the prospect what would be a good time to call
- Capture the prospect's reply
- Tell the prospect you will call them at the given time
- End the call politely

### Language Guidelines Section
- Identify the language the prospect is speaking in and store it as (identified language)
- Politely check with the prospect in Hindi if they would like to speak in the identified language by asking "आप (identified language) में बात करना चाहोगे?"
- Once the prospect confirms, switch to that language and continue speaking in that language until stated otherwise
- When speaking in the (identified language) with the prospect, you MUST use everyday spoken form of the language, you MUST NOT use bookish or accurate translations.
- This is an important instruction and not following this will make the prospect experience on call really bad.
- Use English words like "options", "delivery", "payment", "business", "product", "development", "quality" or "orders" or "inspection" and similar which are commonly used by business owners in India. Do NOT USE hindi words which are not used by speakers in urban India frequently like "udyog" or "vikalp". 

## Success Metrics to Track:
During each conversation, note:
- How engaged they seem (responsive/reluctant)
- Their main concerns
- Their interest level in joining (high/medium/low)
- Missing information that was gathered
- Onboarding status and assistance provided
- If they need follow-up

## Strict Instructions:
1. Do not use any function calls.
2. Mention monetary amount in words.
3. Never use any markup or non ascii characters or asterisk.
4. Never end a conversation unless the prospect shows disinterest or concludes the discussion.
5. If the prospect asks something very very irrelevant tell them that you can only talk about the things related to {product_category}. If they continue, say "आपका time देने के लिए धन्यवाद, हम आपको बाद में call करेंगे. Have a wonderful day." and disconnect the call.
6. If a prospect asks a question that's not part of the context, you should say: "यह एक अच्छा सवाल है। मैं अपने manager से पूछकर आपको वापस कॉल करुँगी।" and start from where you left it off
7. Respond in Hindi with a high frequency of english words used in every sentence and make it easy for the prospect to understand.
8. You can never skip any step so always go back to the step from where the conversation has diverted and complete the step
9. Ask for clarity on any answer if the answer is not clear by saying "माफ़ कीजिये, सुनाई नहीं दिया clearly , वापस बता सकते हो ?"...and start the conversation from there
10. If prospects asks if you are an AI bot speaking or something similar then acknowledge and say that you are an AI sales assistant of {company_short_name}

# Gender-Specific Language
Always use feminine forms of verbs and adjectives when referring to yourself
Use "समझ गई" instead of "समज गया"
Use "कर रही हूँ" instead of "कर रहा हूँ"
Use "बोल रही हूँ" instead of "बोल रहा हूँ"
Consistently maintain feminine linguistic identity throughout the conversation`;

        const hardcodedResultPrompt = `You are an analyst that listens to phone calls between Neha, a female AI bot and prospects.

# MAIN ANALYSIS
## Objective
Your task is to extract specific data points and evaluate based on the conversation audio.

- Interest Status 
	- You must assign an Interest Status as follows
		- INTERESTED - The lead expresses clear intent to know more or continue the conversation and the prospects shows interest by giving some details and answering questions
		- NOT INTERESTED - use this when the prospect clearly rejects or shows disinterest.
		- NEUTRAL - use this when the prospect neither confirms nor denies interest or the prospect sounds unsure, distracted, or postpones the discussion.

- Callback date and time
    - Extract the visit date and time that the lead has provided 
    - Mention as NOT AVAILABLE if this is not covered in conversation

- Relevant Contact Details
If prospect mentions that they are not the relevant person and providee an alternative contact, 
  Capture the phone number and name of the relevant person provided in the call
  Mention as "NA" if this was not convered in the conversation.



- Call Transcript
    - Generate a detailed and accurate call transcript of the whole conversation. 
    - Transcript should contain the speaker name and the dialogues by the speaker for every turn of the conversation
    - Always use English as the language to generate to the transcript. For any language, generate the transcript in English. Do NOT translate, you MUST transliterate
    - Mention it as "Not Available" if no conversation has happened. 
    - Do not add any information that is not part of the call recording.

- Qualification Summary
    - Generate a 4 line summary of the answers the prospect has provided during the qualification section of the conversation
    - Do NOT translate, you MUST transliterate
    - Mention it as "Not Available" if no conversation has happened. 
    - Do not add any information that is not part of the call recording.
    - Mention as NOT AVAILABLE if this is not covered in conversation

## Analysis Guidelines
Contextual Understanding:
Consider cultural context of Hindi conversation
Understand that candidates may be indirect in their responses
Recognize that some candidates may need time to process the opportunity
Account for potential technical issues affecting conversation quality

Validation Checklist
Before submitting evaluation, ensure:

- All required data points are addressed
- Responses match the specified format options
- Quotes are accurate when used
- Call quality assessment is objective
- Any missing information is explicitly noted`;

        const hardcodedResultSchema = {
            "call_transcript": "Entire call transcript",
            "callback_date_time": "Extracted Visit Date and Time",
            "lead_interest_level": "INTERESTED/NOT INTERESTED/NEUTRAL",
            "qualification_summary": "4 line summary of the qualification",
            "relevant_contact_details": "name and phone number"
        };


        const payload: AgentData = { 
            ...agentData,
            agent_prompt: fullPrompt,
            result_prompt: hardcodedResultPrompt,
            result_schema: hardcodedResultSchema,
        };
        
        // Remove empty optional fields
        if (!payload.persona_name) delete payload.persona_name;

        // =================================================================================
        // !! IMPORTANT !!
        // Replace this URL with the actual trigger URL of your deployed Google Cloud Function.
        // You will get this URL after deploying the function from the `/functions` directory.
        // See the new README.md file for deployment instructions.
        // =================================================================================
        const backendApiUrl = 'https://YOUR_CLOUD_FUNCTION_URL_HERE'; 

        if (backendApiUrl.includes('YOUR_CLOUD_FUNCTION_URL_HERE')) {
             setError("Please update the backend API URL in components/AgentForm.tsx before proceeding.");
             setIsLoading(false);
             return;
        }

        try {
            const response = await fetch(backendApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Try to parse error details from the backend's response
                const errorMessage = responseData.error || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            setSuccessMessage(`Agent created successfully! Agent ID: ${responseData.id}`);

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred. Check the browser console for more details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-slate-800 shadow-2xl rounded-lg p-8 border border-slate-700">
                <h1 className="text-3xl font-bold text-center mb-2 text-slate-100">Hunar AI Agent Creator</h1>
                <p className="text-slate-400 text-center mb-8">Configure and deploy a new voice agent. The API key is securely handled.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Agent Name</label>
                            <input type="text" name="name" value={agentData.name} onChange={handleInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor="persona_name" className="block text-sm font-medium text-slate-300 mb-1">Persona Name (Optional)</label>
                            <input type="text" name="persona_name" value={agentData.persona_name} onChange={handleInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                            <select name="language" value={agentData.language} onChange={handleInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none">
                                <option value="ENGLISH">English</option>
                                <option value="HINDI">Hindi</option>
                                <option value="MARATHI">Marathi</option>
                                <option value="TELUGU">Telugu</option>
                                <option value="TAMIL">Tamil</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="voice_persona" className="block text-sm font-medium text-slate-300 mb-1">Voice Persona</label>
                            <select name="voice_persona" value={agentData.voice_persona} onChange={handleInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none">
                                <option value="NEHA">Neha</option>
                                <option value="ROY">Roy</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="agent_prompt" className="block text-sm font-medium text-slate-300 mb-1">Agent Prompt</label>
                        <textarea name="agent_prompt" value={agentData.agent_prompt} onChange={handleInputChange} rows={3} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
                    </div>
                    <div>
                        <label htmlFor="introduction" className="block text-sm font-medium text-slate-300 mb-1">Introduction</label>
                        <textarea name="introduction" value={agentData.introduction} onChange={handleInputChange} rows={3} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-sky-800 disabled:cursor-not-allowed">
                        {isLoading ? <><LoadingSpinner /> Creating Agent...</> : 'Create Agent'}
                    </button>

                    {successMessage && <div className="mt-4 p-4 text-center text-green-200 bg-green-500/20 border border-green-500/30 rounded-md">{successMessage}</div>}
                    {error && <div className="mt-4 p-4 text-center text-red-200 bg-red-500/20 border border-red-500/30 rounded-md">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default AgentForm;
