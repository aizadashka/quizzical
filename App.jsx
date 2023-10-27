import React from 'react'
import Question from './Question'
import {decode} from 'html-entities'

export default function App() {
    const width = window.innerWidth
    const height = window.innerHeight
    
    const [questions, setQuestions] = React.useState([])
    const [allAnswered, setAllAnswered] = React.useState(false)
    const [areAnswersChecked, setAreAnswersChecked] = React.useState(false)
    const [counter, setCounter] = React.useState(0)
    
    React.useEffect(() => {
        setAllAnswered(questions.every(question => question.chosenAnswer))
    }, [questions])
    
    function startQuiz() {
        fetch('https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple')
            .then(res => res.json())
            .then(data => setQuestions(data.results.map((item, index) => {                
                return {
                    ...item,
                    question: decode(item.question).trim(),
                    correct_answer: decode(item.correct_answer).trim(),
                    incorrect_answers: item.incorrect_answers,
                    id: index,
                    shuffledAnswers: shuffle(item.correct_answer, item.incorrect_answers)
                }
            })))
    }

    function shuffle(correctAnswer, incorrectAnswers) {
        return [correctAnswer, ...incorrectAnswers].map((answer, index) => (
            { 
                value: decode(answer).trim(), 
                sort: Math.random(),
                isChosen: false,
            }
        )).sort((a, b) => a.sort - b.sort).map(({value, isChosen}) => ({value, isChosen}))
    }
    
    function getChosenAnswer(event) {       
        setQuestions(oldQuestions => oldQuestions.map(question => {
            const shuffeledAnswersWithChosenOne = question.shuffledAnswers.map(answer => (
                event.target.innerText === answer.value ? 
                    { ...answer, isChosen: true } : 
                    { ...answer, isChosen: false }
            ))

            if (event.target.parentNode.id == question.id) {
                return {
                    ...question,
                    chosenAnswer: event.target.innerText,
                    shuffledAnswers: shuffeledAnswersWithChosenOne
                }
            } else {
                return question
            }    
        }))
    }
    
    function checkAnswers() {
        if (allAnswered && areAnswersChecked) {
            startQuiz()
            setAreAnswersChecked(false)
            setAllAnswered(false)
            setCounter(0)
        } else {
            setAreAnswersChecked(true)
            setQuestions(oldQuestions => oldQuestions.map(question => {
                if (question.correct_answer === question.chosenAnswer) {
                    setCounter(oldCounter => oldCounter + 1)
                }
                return {
                        ...question,
                        shuffledAnswers: question.shuffledAnswers.map(answer => {
                            if (question.correct_answer === answer.value) {
                                return {...answer, isCorrect: true}
                            } else {
                                return {...answer, isCorrect: false}
                            }
                        })
                    }
            }))
        }
    }

    const questionsEl = questions.map(question => (
        <Question
            key={question.id}
            id={question.id}
            question={question.question}
            shuffledAnswers={question.shuffledAnswers}
            getChosenAnswer={getChosenAnswer}
        />
    ))

    return (
        <main>{questions.length > 0 ?
            <div className='questions-page'>
                <h1 className='title'>Quizzical</h1>
                <div className='quiz'>{questionsEl}</div>
                {allAnswered && <div className='buttons'>
                    {allAnswered && areAnswersChecked && <p>You scored {counter}/5 correct answer{counter > 1 ? 's' : ''}</p>}
                      <button className='check-btn' onClick={checkAnswers}>
                        {areAnswersChecked ? 'Play Again' : 'Check Answers'}
                    </button>
                </div>}
            </div> : 
            <div className='start-page'>
                <h1 className='title'>Quizzical</h1>
                <p className='description'>Take some random quiz and make your brain work))</p>
                <button className='start-btn' onClick={startQuiz}>Start quiz</button>
            </div>
        }</main>
    )
}
