import { describe, it, expect, beforeEach } from 'vitest'
import useStore from '../store/useStore'

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      version: 'v1.0.0',
      isDeployed: false,
      deploySuccess: false,
      darkMode: false,
    })
  })

  it('should have correct initial state', () => {
    const state = useStore.getState()
    expect(state.version).toBe('v1.0.0')
    expect(state.isDeployed).toBe(false)
    expect(state.deploySuccess).toBe(false)
    expect(state.darkMode).toBe(false)
  })

  it('should update version', () => {
    useStore.getState().setVersion('v2.0.0')
    expect(useStore.getState().version).toBe('v2.0.0')
  })

  it('should update deployed status', () => {
    useStore.getState().setDeployed(true)
    expect(useStore.getState().isDeployed).toBe(true)
  })

  it('should update deploy success', () => {
    useStore.getState().setDeploySuccess(true)
    expect(useStore.getState().deploySuccess).toBe(true)
  })

  it('should trigger deploy correctly', () => {
    useStore.getState().triggerDeploy()
    const state = useStore.getState()
    expect(state.isDeployed).toBe(true)
    expect(state.deploySuccess).toBe(true)
    expect(state.version).toBe('v1.1.0')
    expect(state.darkMode).toBe(true)
  })
})
