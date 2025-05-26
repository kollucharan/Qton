
import React, { useState } from 'react';
import Header from '../Header/Header'
import axios from 'axios';
import jsPDF from 'jspdf'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './mainComponent.css';
import MyCard from '../Card/Card';
import Footer from '../Footer/Footer';
import Faq from '../FAQ/Faq';
import icon1 from '../../assets/images/download.svg';
import icon2 from '../../assets/images/robot.svg';
import icon3 from '../../assets/images/writing.svg'

function Main() {
  const [formdata, setFormdata] = useState({
    Topic: '',
    questiontype: '',
    difficultylevel: '',
    Noofquestions: 0,
  });
  const [email, setEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showQuestionsPopup, setShowQuestionsPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error1 ,setError1] =useState(false);
  const [error2,setError2] =useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]:
        name === 'Noofquestions' && value !== ''
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

 const downloadpdf = () => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 60;
  const rightMargin = 40;
  const maxWidth = pageWidth - leftMargin - rightMargin;
  const lineHeight = 18;     

  let cursorY = 40;

  
  doc.setFontSize(18);
  doc.text('Generated Questions', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 40;

  doc.setFontSize(12);
  const info = `Type: ${formdata.questiontype} | Difficulty: ${formdata.difficultylevel} | Count: ${formdata.Noofquestions}`;
  doc.text(info, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 40;

 
  questions.forEach((q, qIdx) => {
    
    if (cursorY + 200 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      cursorY = 40;
    }

  
    doc.setFontSize(14);
    doc.text(`Question #${qIdx + 1}`, leftMargin, cursorY);
    cursorY += 25;

   
    doc.setFontSize(11);
    const wrappedQ = doc.splitTextToSize(`${qIdx + 1}. ${q.question}`, maxWidth);
    wrappedQ.forEach(line => {
      doc.text(line, leftMargin, cursorY);
      cursorY += lineHeight;
    });
    cursorY += 10;

   
    if (Array.isArray(q.options)) {
      q.options.forEach((opt, optIdx) => {
        
        let clean = opt
          .toString()
          .replace(/[\\'"`’‘”“]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        const isCorrect = q.correctIndex === optIdx;
        const mark = isCorrect ? '✓ ' : '  ';

        
        const text = `${mark}${clean}`;
        const wrapped = doc.splitTextToSize(text, maxWidth);

        
        wrapped.forEach((line, i) => {
        
          doc.text(line, leftMargin, cursorY);
          cursorY += lineHeight;
        });
      });
    }

    cursorY += 20; 
  });

  doc.save('Quiz_Questions.pdf');
};


  const handleGenerate = () => {
    setError1(false);
    setError2(false);
    const { Topic, questiontype, difficultylevel, Noofquestions } = formdata;
    if (!Topic || !questiontype || !difficultylevel||!Noofquestions) {
    // alert('enter all required fields');
    setError1(true);
      return;
    }
    if (Noofquestions < 5 || Noofquestions > 10) {
      // alert('Number of questions should be between 5 and 10');
      setError2(true);
      return;
    }
    setShowEmailPopup(true);
  };

  const handleSubmitEmail = async (e, closePopup) => {
    e.preventDefault();
     setIsLoading(true);
    try {
      const resp = await axios.post(
        'https://qton.onrender.com/generatequiz',
        {
          topic: formdata.Topic,
          question_type: formdata.questiontype,
          difficulty: formdata.difficultylevel,
          num_questions: formdata.Noofquestions,
          email,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
   console.log(resp.data);
      
      console.log(resp.data.questions);
      setQuestions(resp.data.questions || []);
      setShowEmailPopup(false);
      setShowQuestionsPopup(true);
      closePopup();
    } catch (err) {
      console.error('Error generating quiz:', err);
      alert('Something went wrong. Check console for details.');
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
     
    <>
    <Header/>
    <div className="main-container">
   
      <div className="hea">
        <h1>
          Q-ton: AI Quiz Generator 
        </h1>
        <h2> Instantly Create Smart Questions for Tests
          and Assessments.</h2>
        <p>
          Craft educational content effortlessly with Q-ton. Enter your topic,
          set your preferences, and generate high-quality questions instantly.
        </p>
      </div>

      <div className="card">
        <form onSubmit={e => e.preventDefault()}>
          <h3>Question Generator</h3>

          <div className="form-group">
            <label htmlFor="Topic">Topic</label>
            <textarea
              id="Topic"
              name="Topic"
              value={formdata.Topic}
              onChange={handleChange}
              placeholder="Enter a brief topic,or detailed text"
            />
          </div>

          <div className="form-group">
            <label htmlFor="questiontype">Question Type</label>
            <select
              id="questiontype"
              name="questiontype"
              value={formdata.questiontype}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select question type
              </option>
              <option value="mcq">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="shortanswer">Short Answer</option>
              <option value="essay">Essay</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficultylevel">Difficulty Level</label>
            <select
              id="difficultylevel"
              name="difficultylevel"
              value={formdata.difficultylevel}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select difficulty level
              </option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Noofquestions">Number of Questions</label>
            <input
              id="Noofquestions"
              type="number"
              name="Noofquestions"
              value={formdata.Noofquestions || ''}
              onChange={handleChange}
              placeholder="Enter a value between 5 and 10"
              min="1"
              max="10"
            />
          </div>
         {error1 && <p className="error-message">Enter all Required Fields</p>}
        {error2 && <p className="error-message">Number of questions should be between 5 and 10</p>}

          <button
            type="button"
            className="generate-btn"
            onClick={handleGenerate}
          >
            Generate Questions
          </button>
         
        </form>
      </div>

     
      <Popup
        open={showEmailPopup}
        closeOnDocumentClick
        onClose={() => setShowEmailPopup(false)}
        modal
        lockScroll
        contentStyle={{
          width: '600px',
          maxWidth: '90%',
          padding: 0,
          borderRadius: '14px',
        }}
      >
        {(close) => (
          <div
            style={{
              padding: '1.5rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{marginBottom:'15px'}}>Enter your email to generate questions</h2>
            <div className="form-group">
           
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter Business Email"
                style={{ width: '100%' }}
              />
            </div>
            <button
              className="generate-btn-pop"
              style={{ width: '100%' }}
              onClick={(e) => handleSubmitEmail(e, close)}
            >
          
                {isLoading ? (
    <>
      <div className="spinner" />
      Generating Questions...
    </>
  ) : (
    'Submit and Generate'
  )}
            </button>
          </div>
        )}
      </Popup>
     <Popup 
  open={showQuestionsPopup} 
  closeOnDocumentClick 
  onClose={() => setShowQuestionsPopup(false)} 
  modal 
  lockScroll 
  contentStyle={{ 
    maxWidth: '900px', 
    width: '90vw', 
    maxHeight: '85vh',
    padding: '0',
    borderRadius: '8px',
    overflow: 'hidden'
  }}
>
  {(close) => (
    <div className="questions-popup-container">
     
      <div className="questions-popup-header">
        <h3>Generated Questions</h3>
        <button onClick={close} className="close-btn">
          ×
        </button>
      </div>
      
     
      <div className="questions-popup-info">
        <strong>Type:</strong> {formdata.questiontype} | {' '}
        <strong>Difficulty:</strong> {formdata.difficultylevel} | {' '}
        <strong>Count:</strong> {formdata.Noofquestions}
      </div>
      
     
      <div className="questions-popup-content">
        {questions.map((q, idx) => (
          <div key={idx} className="question-item">
            <div className="question-text">
              {idx + 1}. {q.question}
            </div>
            
            {q.options && (
              <ul className="question-options">
                {q.options.map((opt, i) => (
                  <li key={i} className="option-item">
                    {opt}
                    {q.answer && opt.includes(q.answer) && (
                      <span className="correct-mark"> ✓</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            
          </div>
        ))}
        
      
        <div className="download-pdf-section">
          <button className="download-pdf-btn" onClick={downloadpdf}>
            📄 Download PDF
          </button>
        </div>
      </div>
    </div>
  )}
</Popup>
    </div>
   <div className='card-parent'>
    <h1>How Q-ton AI Quiz Maker Works</h1>
    <div className='card-below'>

       <MyCard  title={'Generate Quizzes with AI – Instantly'}  children={'Specify your topic, choose the question type, set the difficulty level, and define the number of questions to effortlessly generate quizzes with AI, tailored to your needs.'} icon={icon3}/>
         <MyCard title={'AI-Powered Question Generator'}  children={'Our advanced AI processes your inputs and creates relevant, high-quality questions to meet your specifications.'} icon={icon2}/>
           <MyCard title={'Export and Use Instantly'}  children={'Review your generated questions and easily download them in PDF format for immediate use in your educational materials.'} icon={icon1}/>
    </div>
     </div>
     
     <div className="benefits">
      <h1 className='cl'>Benefits of Using Our Free AI Quiz Generator</h1>

      <div className="benefits__content">
        <img
          src="https://www.talview.com/hs-fs/hubfs/quizz%20app.jpg?width=400&height=320&name=quizz%20app.jpg"
          alt="Talview quiz app"
          className="benefits__image"
        />

        <ul className="benefits__list">
          <li>1.Instantly generate quizzes for any topic or subject</li>
          <li>2.Customize difficulty levels and question types with ease</li>
          <li>3.Pair with AI proctoring tools for end-to-end automation of test creation</li>
          <li>4.<b>Generate questions in real-time</b> to test specific candidate skills during any remote interviews</li>
        </ul>
      </div>
    </div>
   
      <div className='faq'>
      <Faq/>
      </div>

    <Footer/>
    </>
  );
}

export default Main;

