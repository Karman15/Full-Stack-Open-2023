import { useState } from 'react'

const FeedbackTitle = () => <h1>give feedback</h1>

const StatisticsTitle = () => <h1>statistics</h1>

const StatisticLine = ({text, value}) => (<tr><td>{text} </td><td> {value} </td></tr>)

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  const average = (good - bad)/total
  const positive = good/total * 100
  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <>
      <table>
      <tbody>
        <StatisticLine text = "good" value = {good} />
        <StatisticLine text = "neutral" value = {neutral} />
        <StatisticLine text = "bad" value = {bad} />
        <StatisticLine text = "all" value = {total} />
        <StatisticLine text = "average" value = {average} />
        <StatisticLine text = "positive" value = {positive} />
      </tbody>
      </table>
    </>
  )
}

const Button = ({handleClick, text}) => (<button onClick={handleClick}>{text}</button>)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <FeedbackTitle/>
      <div>
        <Button handleClick = {() => setGood(good + 1)} text = "good"/>
        <Button handleClick = {() => setNeutral(neutral + 1)} text = "neutral"/>
        <Button handleClick = {() => setBad(bad + 1)} text = "bad"/>
      </div>
      <StatisticsTitle/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </>
  )
}

export default App