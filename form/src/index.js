import React from 'react'
import PropTypes from 'prop-types'

const noop = () => ({})

export class ControlledForm extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validateOnBlur: PropTypes.bool,
    validateOnChange: PropTypes.bool,
    validateOnSubmit: PropTypes.bool,
  }

  static defaultProps = {
    values: {},
    validate: noop,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnSubmit: true,
  }

  state = {
    touched: {},
    errors: {},
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setFieldValue(name, value, this.props.validateOnChange)
  }

  handleBlur = e => {
    const { name, value } = e.target
    this.setState(state => ({
      touched: {
        ...state.touched,
        [name]: true
      }
    }), () => {
      if (!this.props.validateOnBlur) return
      this.validate(this.props.values)
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { values } = this.props
    if (this.props.validateOnSubmit) {
      this.validate(values, () => {
        this.props.onSubmit(values, this.state)
      })
    } else {
      this.props.onSubmit(values, this.state)
    }
  }

  validate = (values, callback) => {
    const errors = this.props.validate(values)
    this.setState({ errors }, callback)
  }

  setFieldValue = (name, value, shouldValidate) => {
    const next = {
      [name]: value
    }
    this.props.onChange(next)
    if (shouldValidate) this.validate(next)
  }

  render () {
    const { render, values } = this.props
    const { touched, errors } = this.state

    return render({
      values,
      touched,
      errors,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onSubmit: this.handleSubmit,
      setFieldValue: this.setFieldValue
    })
  }
}

export class UncontrolledForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    initialValues: {},
    onChange: noop
  }

  state = {
    values: this.props.initialValues,
  }

  handleChange = values => {
    this.setState({ values })
    this.props.onChange(values)
  }

  render () {
    const { initialValues, onChange, ...props } = this.props
    const { values } = this.state

    return (
      <Form
        {...props}
        values={values}
        onChange={this.handleChange}
      />
    )
  }
}

export const Form = props => {
  if (typeof props.onChange === 'function') {
    return <ControlledForm {...props} />
  }
  return <UncontrolledForm {...props} />
}

export default Form
