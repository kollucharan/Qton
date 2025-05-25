import React from 'react';
import MyAccordion from '../Accordion/Accordion';
import './Faq.css'
export default function Faq() {

    const faqs = [
        { id: 1, title: 'Do I need an account to use the Q-ton AI Quiz Generator?', content: 'No, you can try Q-ton AI Quiz Generator online for free by entering your business mail in just a click.' },
        { id: 2, title: 'Can evaluators use Q-ton during live online interviews?', content: 'Yes, Q-ton allows evaluators to instantly generate role-specific quizzes during live interviews, enabling real-time skill assessments.' },
        { id: 3, title: 'How many questions can I add to a quiz?', content: 'With Q-ton, you can generate up to 10 questions per quiz request, allowing you to customize the quiz to suit your needs. You can submit multiple requests if you need more questions. Just give the AI a moment to process each request.' },
    ];

    return (
        <div className='faqdesign'>

            <h1 >Frequently Asked Questions(FAQ)</h1>
            {

                faqs.map((item) => {
                    return (

                        <div style={{marginBottom:'20px'}}>

                            <MyAccordion title={item.title} content={item.content}  sx={{ width: '670px', margin: '0 auto',padding:'5px 5px',  borderRadius: '20px', overflow: 'hidden',}}/>

                        </div>

                    )
                })


            }
        </div>
    )

}