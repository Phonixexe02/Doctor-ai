// chat.js
document.addEventListener("DOMContentLoaded",()=>{
  const GEMINI_API_KEY="AIzaSyDYUIsw9Rv-DIwTQEzqRJ2DKri1fXTEwyE"; // Replace with your actual key
  const chatForm=document.getElementById("chatForm");
  const userInput=document.getElementById("userInput");
  const chatWindow=document.getElementById("chatWindow");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const languageSelect = document.getElementById("languageSelect");
  let isLoading = false;
  let currentLanguage = "en"; // Default to English

  // Language change handler
  languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value;
    updateUILanguage();
  });

  function updateUILanguage() {
    const translations = {
      en: {
        placeholder: "Describe your symptoms…",
        title: "Medical Chat",
        subtitle: "DoctorAI — Your Personal AI",
        welcomeTitle: "✨ Hello! I am DoctorAI",
        welcomeSubtitle: "How can I help you today?",
        welcomeFooter: "This is a small project using the Gemini API.",
        disclaimer: "⚠️ D0ctorAI is not a doctor. For emergencies, consult a healthcare professional immediately.",
        sendBtn: "Send"
      },
      ne: {
        placeholder: "आफ्ना लक्षणहरू वर्णन गर्नुहोस्…",
        title: "चिकित्सा च्याट",
        subtitle: "डाक्टर एआई — शान्त, व्यावसायिक स्वर (डाक्टर होइन)",
        welcomeTitle: "✨ नमस्कार! म मेडिबट हुँ",
        welcomeSubtitle: "आज म तपाईंलाई कसरी मद्दत गर्न सक्छु?",
        welcomeFooter: "यो जेमिनी एपीआई प्रयोग गरेर बनेको सानो परियोजना हो।",
        disclaimer: "⚠️ डाक्टर एआई  डाक्टर होइन। आपतकालका लागि, तुरुन्त स्वास्थ्यकर्मीसँग सम्पर्क गर्नुहोस्।",
        sendBtn: "पठाउनुहोस्"
      }
    };

    const t = translations[currentLanguage];
    
    // Update UI elements
    userInput.placeholder = t.placeholder;
    document.querySelector(".top-title h2").textContent = t.title;
    document.querySelector(".top-title .sub").textContent = t.subtitle;
    document.querySelector(".welcome-message-title").textContent = t.welcomeTitle;
    document.querySelector(".welcome-message-subtitle").textContent = t.welcomeSubtitle;
    document.querySelector(".welcome-card-footer p").textContent = t.welcomeFooter;
    document.querySelector(".disclaimer").textContent = t.disclaimer;
    document.querySelector(".btn").textContent = t.sendBtn;
  }

  chatForm.addEventListener("submit",async e=>{
    e.preventDefault();
    const text=userInput.value.trim();
    if(!text || isLoading) return;
    
    // Hide the welcome screen and show the chat window
    if (welcomeScreen) {
        welcomeScreen.style.display = "none";
        chatWindow.style.display = "flex";
    }
    
    userInput.value="";
    addMessage("user",text);
    isLoading = true;
    const loadingMessage = addLoadingIndicator();
    const reply=await getGeminiReply(text);
    removeLoadingIndicator(loadingMessage);
    addMessage("bot",reply);
    isLoading = false;
  });

  function addMessage(who,text){
    const div=document.createElement("div");
    div.className=`message ${who}`;
    
    // Basic text formatting for better readability
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold** -> <strong>
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic* -> <em>
      .replace(/\n/g, '<br>'); // line breaks
    
    div.innerHTML = formattedText;
    chatWindow.appendChild(div);
    chatWindow.scrollTop=chatWindow.scrollHeight;
  }
  
  function addLoadingIndicator() {
    const div = document.createElement("div");
    div.className = "message bot loading-dots";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
  }

  function removeLoadingIndicator(indicator) {
    if (indicator) {
      indicator.remove();
    }
  }

  function systemPrompt(userMessage){
    const prompts = {
      en: `You are DoctorAI, an empathetic AI medical assistant.
User symptoms: ${userMessage}

Guidelines:
- Keep responses concise and easy to read
- Use simple numbered lists (1. 2. 3.) instead of asterisks or markdown
- Ask 2-3 key follow-up questions about symptoms
- Suggest possible causes and simple home remedies
- Always end with: "I am not a doctor. Please consult a licensed healthcare professional."
- If symptoms are severe (chest pain, difficulty breathing, severe bleeding), advise immediate medical help
- Use plain text formatting only - no markdown, asterisks, or special formatting
- Keep each response under 200 words
- Respond in English

Speak in a calm, professional, conversational tone.`,
      
      ne: `तपाईं मेडिबट हुनुहुन्छ, एक सहानुभूतिशील एआई चिकित्सा सहायक।
प्रयोगकर्ताका लक्षणहरू: ${userMessage}

दिशानिर्देशहरू:
- जवाफहरू संक्षिप्त र पढ्न सजिलो राख्नुहोस्
- तारा वा मार्कडाउनको सट्टा सरल संख्याबद्ध सूचीहरू (१. २. ३.) प्रयोग गर्नुहोस्
- लक्षणहरूको बारेमा २-३ मुख्य फलोअप प्रश्नहरू सोध्नुहोस्
- सम्भावित कारणहरू र सरल घरेलु उपचारहरू सुझाव दिनुहोस्
- सधैं यसको साथ समाप्त गर्नुहोस्: "म डाक्टर होइन। कृपया इजाजतपत्र प्राप्त स्वास्थ्यकर्मीसँग सल्लाह लिनुहोस्।"
- यदि लक्षणहरू गम्भीर छन् भने तुरुन्त चिकित्सा सहायताको सल्लाह दिनुहोस्
- केवल सादा पाठ ढाँचा प्रयोग गर्नुहोस्
- प्रत्येक जवाफ २०० शब्दभन्दा कम राख्नुहोस्
- नेपालीमा जवाफ दिनुहोस्

शान्त, व्यावसायिक, कुराकानीमूलक स्वरमा बोल्नुहोस्।`
    };
    
    return prompts[currentLanguage] || prompts.en;
  }

  async function getGeminiReply(userMessage){
    try{
      const payload={contents:[{parts:[{text:systemPrompt(userMessage)}]}]};
      const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+encodeURIComponent(GEMINI_API_KEY),{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      const data=await res.json();
      const text=data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if(text) {
        const disclaimers = {
          en: "I am not a doctor. Please consult a licensed healthcare professional.",
          ne: "म डाक्टर होइन। कृपया इजाजतपत्र प्राप्त स्वास्थ्यकर्मीसँग सल्लाह लिनुहोस्।"
        };
        const disclaimer = disclaimers[currentLanguage] || disclaimers.en;
        return text.includes("doctor") || text.includes("डाक्टर") ? text : text + "\n\n" + disclaimer;
      }
      
      const noResponse = {
        en: "Sorry, no response.",
        ne: "माफ गर्नुहोस्, कुनै जवाफ छैन।"
      };
      return noResponse[currentLanguage] || noResponse.en;
    }catch(err){
      console.error("Error fetching from Gemini API:",err);
      const errorMsg = {
        en: "Sorry, something went wrong.",
        ne: "माफ गर्नुहोस्, केहि गलत भयो।"
      };
      return errorMsg[currentLanguage] || errorMsg.en;
    }
  }

  // Initialize UI language on load
  updateUILanguage();
});