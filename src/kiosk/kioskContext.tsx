import { QrCodeReader } from './QrCodeReader'

import { AttendeeTotpViewModel, AttendeeTotpController } from '../attendee-totp'
import { KioskViewModel, KioskCheckInController } from '../checkin-kiosk'
import { createContext, ReactNode } from 'react'
import React from 'react'

type ProviderProps<X> = {
  children: (data: X) => ReactNode
}

export interface KioskContext {
  TotpProvider: React.ComponentClass<ProviderProps<AttendeeTotpViewModel>>
  KioskCheckInProvider: React.ComponentClass<ProviderProps<KioskViewModel>>
  QrCodeReader: React.ComponentClass<{ onScan: (code: string) => any }>
}
export const kioskContext = createContext<KioskContext>({
  TotpProvider: AttendeeTotpController,
  KioskCheckInProvider: KioskCheckInController,
  QrCodeReader: QrCodeReader
})
