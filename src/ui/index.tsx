import React from 'react'
import styled from 'react-emotion'
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
