import '@testing-library/jest-dom'
import { act, fireEvent, render } from '@testing-library/react'
import { parseHotkey } from 'is-hotkey'
import React, { useMemo, useState } from 'react'
import Smartkeys, {
  useGroupedSmartkeys,
  useSmartkeys,
  SmartkeyDefinition
} from '.'

jest.setTimeout(3000)

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

describe('Smartkeys', () => {
  it('should be truthy', () => {
    expect(Smartkeys.Provider).toBeTruthy()
    expect(useSmartkeys).toBeTruthy()
    expect(useGroupedSmartkeys).toBeTruthy()
  })

  it('should render', () => {
    const testMessage = 'Hello world'

    const Test = () => {
      return <Smartkeys.Provider>{testMessage}</Smartkeys.Provider>
    }

    const container = render(<Test />)

    expect(container.getByText(testMessage)).toBeInTheDocument()
  })

  it('should register/unregister hotkey', () => {
    const keyDef: SmartkeyDefinition = {
      key: 'mod+k',
      group: 'main'
    }

    const TestSmartkeyConsumer = () => {
      const calledKey = useSmartkeys(keyDef)

      return <div>{calledKey}</div>
    }

    const Test = () => {
      const [registered, setRegister] = useState(true)

      return (
        <Smartkeys.Provider>
          {registered ? <TestSmartkeyConsumer /> : <div>no-key</div>}
          <button onClick={() => setRegister(false)}>Unregister</button>
        </Smartkeys.Provider>
      )
    }

    const container = render(<Test />)

    fireEvent.keyUp(container.baseElement, {
      ctrlKey: true,
      key: 'k'
    })

    expect(container.getByText(keyDef.key)).toBeInTheDocument()

    fireEvent.click(container.getByText('Unregister'), {})

    expect(container.getByText('no-key')).toBeInTheDocument()
  })

  it('should register multiple hotkeys', async () => {
    const keyList: SmartkeyDefinition[] = [
      {
        key: 'mod+k',
        group: 'main'
      },
      {
        key: 'shift+a',
        group: 'main'
      }
    ]

    const TestSmartkeyConsumer = () => {
      const calledKey = useSmartkeys(keyList)

      return <div>{calledKey}</div>
    }

    const Test = () => {
      return (
        <Smartkeys.Provider>
          <TestSmartkeyConsumer />
        </Smartkeys.Provider>
      )
    }

    const container = render(<Test />)

    fireEvent.keyUp(container.baseElement, {
      ctrlKey: true,
      key: 'k'
    })

    expect(container.getByText(keyList[0].key)).toBeInTheDocument()

    await act(async () => {
      await sleep(1000)
    })

    act(() => {
      fireEvent.keyUp(container.baseElement, {
        shiftKey: true,
        key: 'a'
      })
    })

    expect(container.getByText(keyList[1].key)).toBeInTheDocument()
  })

  it('should chain multiple hotkeys', async () => {
    const keyDef: SmartkeyDefinition = {
      key: 'mod+k alt+a',
      group: 'main'
    }

    const TestSmartkeyConsumer = () => {
      const calledKey = useSmartkeys(keyDef)

      return <div>{calledKey}</div>
    }

    const Test = () => {
      return (
        <Smartkeys.Provider>
          <TestSmartkeyConsumer />
        </Smartkeys.Provider>
      )
    }

    const container = render(<Test />)

    fireEvent.keyUp(container.baseElement, {
      ctrlKey: true,
      key: 'k'
    })

    await act(async () => {
      await sleep(100)
    })

    fireEvent.keyUp(container.baseElement, {
      altKey: true,
      key: 'a'
    })

    expect(container.getByText(keyDef.key)).toBeInTheDocument()
  })

  it('should register all available hotkeys', async () => {
    const keyDef1: Omit<SmartkeyDefinition, 'group'> = {
      key: 'ctrl+b'
    }

    const keyDef2: Omit<SmartkeyDefinition, 'group'> = {
      key: 'mod+k alt+a',
      passthrough: true
    }

    const getStr = (obj) =>
      Object.entries(obj)
        .map(([k, v]) => [k, typeof v === 'object' ? getStr(v) : v])
        .flat()
        .join(':')

    const TestSmartkeyConsumer1 = () => {
      const keyDef = useMemo(() => ({ ...keyDef1, group: 'main' }), [])

      useSmartkeys(keyDef)

      return null
    }

    const TestSmartkeyConsumer2 = () => {
      const keyDef = useMemo(() => ({ ...keyDef2, group: 'main' }), [])

      useSmartkeys(keyDef)

      return null
    }

    const TestSmartkeyGroupConsumer = () => {
      const groups = useGroupedSmartkeys()

      return (
        <div>
          {Object.entries(groups).map(([group, defs]) =>
            defs.map((def) => (
              <div key={`${group}:${def.key}`}>{getStr(def)}</div>
            ))
          )}
        </div>
      )
    }

    const Test = () => {
      return (
        <Smartkeys.Provider>
          <TestSmartkeyConsumer1 />
          <TestSmartkeyConsumer2 />

          <TestSmartkeyGroupConsumer />
        </Smartkeys.Provider>
      )
    }

    const container = render(<Test />)

    const getDef = (def) => ({
      ...def,
      hotkey:
        def.key.indexOf(' ') > 0
          ? def.key.split(' ').map((k) => parseHotkey(k))
          : parseHotkey(def.key)
    })

    expect(container.getByText(getStr(getDef(keyDef1)))).toBeInTheDocument()
    expect(container.getByText(getStr(getDef(keyDef2)))).toBeInTheDocument()
  })

  it('should only trigger hotkeys with passthrough when inputting', async () => {
    const keyList: SmartkeyDefinition[] = [
      {
        key: 'mod+k mod+a',
        group: 'main',
        passthrough: true
      },
      {
        key: 'shift+a',
        group: 'main',
        passthrough: false
      }
    ]

    const TestSmartkeyConsumer = () => {
      const calledKey = useSmartkeys(keyList)

      return <div>{calledKey}</div>
    }

    const Test = () => {
      return (
        <Smartkeys.Provider>
          <TestSmartkeyConsumer />
          <input data-testid='input-focus' />
          <textarea data-testid='textarea-focus'></textarea>
          <div data-testid='div-focus' contentEditable />
        </Smartkeys.Provider>
      )
    }

    const container = render(<Test />)
    const input = container.getByTestId('input-focus')
    const div = container.getByTestId('div-focus')
    const textarea = container.getByTestId('div-focus')

    for (const focusedContainer of [input, div, textarea]) {
      fireEvent.keyUp(focusedContainer, {
        ctrlKey: true,
        key: 'k'
      })

      await act(async () => {
        await sleep(100)
      })

      fireEvent.keyUp(focusedContainer, {
        ctrlKey: true,
        key: 'a'
      })

      expect(container.getByText(keyList[0].key)).toBeInTheDocument()

      await act(async () => {
        await sleep(300)
      })

      act(() => {
        fireEvent.keyUp(focusedContainer, {
          shiftKey: true,
          key: 'a'
        })
      })

      expect(container.getByText(keyList[0].key)).toBeInTheDocument()
    }
  })
})
