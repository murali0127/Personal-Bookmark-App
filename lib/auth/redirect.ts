function normalizeBaseUrl(value?: string) {
      const rawValue = value?.trim()
      if (!rawValue) return ''

      try {
            const url = new URL(rawValue)
            url.pathname = '/'
            return url.origin
      } catch {
            return rawValue.replace(/\/+$/, '')
      }
}

export function getAppBaseUrl() {
      const envBaseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL)
      if (envBaseUrl) return envBaseUrl

      if (typeof window !== 'undefined') {
            return window.location.origin
      }

      return 'http://localhost:3000'
}

export function buildAppUrl(path: string) {
      const baseUrl = getAppBaseUrl()
      return new URL(path, `${baseUrl}/`).toString()
}
