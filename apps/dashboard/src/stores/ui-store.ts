import { Store, useStore } from "@tanstack/react-store"

type UiState = {
    sidebarRailVisible: boolean
}

const initial: UiState = {
    sidebarRailVisible: true,
}

export const uiStore = new Store<UiState>(initial)

export function useUiStore<T>(selector: (s: UiState) => T): T {
    return useStore(uiStore, selector)
}

export function setSidebarRailVisible(visible: boolean) {
    uiStore.setState((s) => ({ ...s, sidebarRailVisible: visible }))
}
