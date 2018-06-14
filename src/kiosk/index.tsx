import React, { ReactNode, createContext } from 'react'

export interface KioskContext {
  TotpProvider: ProviderComponent<string>
}

type ProviderProps<X> = {
  children: (data: X) => ReactNode
}
type ProviderComponent<X> = React.ComponentClass<ProviderProps<X>>

export const mockKioskContext: KioskContext = {
  TotpProvider: class MockTotpProvider extends React.Component<
    ProviderProps<string>
  > {
    render() {
      return this.props.children('123456')
    }
  }
}

export const kioskContext = createContext<KioskContext>(mockKioskContext)
