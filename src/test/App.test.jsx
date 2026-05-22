import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import useStore from '../store/useStore'

describe('App', () => {
  beforeEach(() => {
    useStore.setState({
      version: 'v1.0.0',
      isDeployed: false,
      deploySuccess: false,
      darkMode: false,
    })
  })

  it('should render without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('should contain main element', () => {
    const { container } = render(<App />)
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
  })

  it('should apply dark-mode class when darkMode is true', () => {
    useStore.setState({ darkMode: true })
    render(<App />)
    expect(document.body.classList.contains('dark-mode')).toBe(true)
  })

  it('should not have dark-mode class when darkMode is false', () => {
    document.body.classList.remove('dark-mode')
    useStore.setState({ darkMode: false })
    render(<App />)
    expect(document.body.classList.contains('dark-mode')).toBe(false)
  })
})
