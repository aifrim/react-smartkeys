import { HotKey, parseHotkey } from 'is-hotkey'
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

type Callback = () => void

export type Groups = string

export type SmartkeyDefinition = {
  key: string
  passthrough?: boolean
  group: Groups
}

type SmartkeyDefinitionStorage = {
  keyDef: SmartkeyDefinition
  cb: Callback
}

type SmartkeysContext = {
  register: (keyDef: SmartkeyDefinition, cb: Callback) => void
  unregister: (keyDef: SmartkeyDefinition) => void
  storage: Record<string, SmartkeyDefinitionStorage>
}

const Smartkeys = createContext<SmartkeysContext>({
  register: () => {},
  unregister: () => {},
  storage: {}
})

type SmartkeysProviderProps = PropsWithChildren<{
  keyChainingTime?: number
}>

function Provider({ children, keyChainingTime = 200 }: SmartkeysProviderProps) {
  const keyChainingTimeRef = useRef(keyChainingTime)

  const [storage, store] = useState<SmartkeysContext['storage']>({})
  const storageRef = useRef(storage)
  storageRef.current = storage

  const [lastKey, storeLastKey] = useState<string[]>([])
  const lastKeyRef = useRef(lastKey)
  lastKeyRef.current = lastKey

  const register = useCallback((keyDef: SmartkeyDefinition, cb: Callback) => {
    store((storage) => ({
      ...storage,
      [keyDef.key]: {
        keyDef,
        cb
      }
    }))
  }, [])

  const unregister = useCallback((keyDef: SmartkeyDefinition) => {
    store((storage) => {
      const ns = { ...storage }

      delete ns[keyDef.key]

      return ns
    })
  }, [])

  useEffect(() => {
    const toHotkeyName = (hotkey: HotKey) => {
      const name = []

      if (hotkey.ctrlKey || hotkey.metaKey) name.push('mod')
      if (hotkey.shiftKey) name.push('shift')
      if (hotkey.altKey) name.push('alt')

      name.push(hotkey.key?.toLocaleLowerCase())

      return name.join('+')
    }

    const getHotkeyName = (event: KeyboardEvent) => {
      const eventHotkey = {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        key: event.key
      }

      return toHotkeyName(eventHotkey)
    }

    const cb = (event: KeyboardEvent) => {
      const target = event.target

      const inputting =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLDivElement &&
          target.getAttribute('contenteditable') === 'true')

      const keys = [...lastKeyRef.current, getHotkeyName(event)].filter(
        (key) => !!key
      )

      const stored = storageRef.current[keys.join(' ')]

      if (stored && (!inputting || stored.keyDef.passthrough)) {
        stored.cb()
      }

      storeLastKey(keys)
    }

    document.body.addEventListener('keyup', cb)

    return () => {
      document.body.removeEventListener('keyup', cb)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(
      () => storeLastKey([]),
      keyChainingTimeRef.current
    )

    return () => clearTimeout(timeout)
  }, [lastKey])

  return (
    <Smartkeys.Provider value={{ register, unregister, storage }}>
      {children}
    </Smartkeys.Provider>
  )
}

type UseSmartkeysProp = SmartkeyDefinition | SmartkeyDefinition[]

export function useSmartkeys(props: UseSmartkeysProp) {
  const { register, unregister } = useContext(Smartkeys)
  const [called, call] = useState<string>()

  useEffect(() => {
    const newSmartKeys = props instanceof Array ? props : [props]

    const cbs = newSmartKeys.map((nsk) => {
      const cb: Callback = () => {
        call(nsk.key)
      }

      register(nsk, cb)

      return nsk
    })

    return () => {
      cbs.forEach((cb) => unregister(cb))
    }
  }, [props])

  return called
}

export type SmartkeyGroupedDefinition = Pick<
  SmartkeyDefinition,
  'key' | 'passthrough'
> & {
  hotkey: HotKey | HotKey[]
}

export function useGroupedSmartkeys(): Record<
  Groups,
  SmartkeyGroupedDefinition[]
> {
  const { storage } = useContext(Smartkeys)

  return useMemo(
    () =>
      Object.values(storage).reduce(
        (acc, { keyDef: { group, key, passthrough } }) => ({
          ...acc,
          [group]: [
            ...(acc[group] ?? []),
            {
              key,
              ...(passthrough ? { passthrough } : {}),
              hotkey:
                key.indexOf(' ') > 0
                  ? key.split(' ').map((k) => parseHotkey(k))
                  : parseHotkey(key)
            }
          ]
        }),
        {}
      ),
    [storage]
  )
}

export default {
  Provider
}
