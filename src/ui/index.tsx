import React from 'react'
import styled, { keyframes } from 'react-emotion'
import { Fonts } from '../design'

export const Button = styled('button')({
  font: 'inherit',
  border: '1px solid #00d8ff',
  padding: '2px 5px',
  background: '#00d8ff',
  color: '#000',
  '&:disabled': {
    opacity: 0.5,
    background: '#888',
    borderColor: '#888'
  }
})

export const TextField = styled('input')({
  font: 'inherit',
  padding: '2px 2px',
  border: '1px solid #00d8ff',
  background: '#000',
  color: '#fff',
  '&:disabled': {
    opacity: 0.5,
    borderColor: '#888'
  }
})

export const HBox = styled('div')(
  {
    display: 'flex',
    '& > *:not(:first-child)': {
      marginLeft: '10px'
    }
  },
  (props: { alignItems?: string }) => ({
    alignItems: props.alignItems
  })
)

export const VBox = styled('div')({
  '& > *:not(:first-child)': {
    marginTop: '10px'
  }
})

export class Panel extends React.Component<{ title: string }> {
  render() {
    return (
      <Fieldset>
        <legend>{this.props.title}</legend>
        {this.props.children}
      </Fieldset>
    )
  }
}

const Fieldset = styled('fieldset')({
  border: '2px solid #777',
  '& > legend': {
    color: '#888',
    textTransform: 'uppercase',
    fontFamily: Fonts.display
  }
})

export class Loading extends React.Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner />
        <br />
        {this.props.children}
      </div>
    )
  }
}

const rotateAnimation = keyframes({
  from: { transform: 'rotate(0)' },
  to: { transform: 'rotate(360deg)' }
})

const Spinner = styled('div')({
  display: 'inline-block',
  width: 30,
  height: 30,
  borderRadius: 30,
  border: '10px solid #777',
  borderLeftColor: 'transparent',
  animation: `0.2s ${rotateAnimation} linear infinite`
})

export class ErrorMessage extends React.Component {
  render() {
    return (
      <div style={{ padding: 10, background: '#944', color: '#fff' }}>
        {this.props.children}
      </div>
    )
  }
}
