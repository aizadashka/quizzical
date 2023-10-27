import React from 'react'

export default function Question({question, shuffledAnswers, getChosenAnswer, id}) {    
    const answersEL = shuffledAnswers.map((answer, index) => {
        let styles = {
            border: answer.isChosen ? 'none' : '1px solid #4D5B9E',
            background: answer.isChosen ? '#D6DBF5' : 'white', 
        }
        
        if (typeof answer.isCorrect !== 'undefined') {
            if (answer.isCorrect) {
                styles.background = '#94D7A2'
                styles.border = 'none'
            } else if (answer.isChosen && !answer.isCorrect) {
                styles.background = '#F8BCBC'
            } else {
                styles.background = 'white'
            }
        }
        
        return <div 
            className='answer' 
            style={styles} 
            onClick={getChosenAnswer} 
            key={index}>
                {answer.value}
        </div>
    })
    
    return (
        <div className='qa' >
            <h3 className='question'>{question}</h3>
            <div className='answers' id={id}>{answersEL}</div>
        </div>
    )
}
