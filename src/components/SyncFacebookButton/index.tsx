'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

interface SyncProgress {
  type: 'start' | 'progress' | 'complete' | 'error' | 'info'
  current?: number
  total?: number
  post?: string
  status?: 'importing' | 'imported' | 'skipped' | 'error' | 'importing_image'
  message: string
  imported?: number
  skipped?: number
  errors?: number
}

interface RepairResult {
  success: boolean
  message: string
  repaired: number
  errors: string[]
}

export const SyncFacebookButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<SyncProgress | null>(null)
  const [progressHistory, setProgressHistory] = useState<SyncProgress[]>([])
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Repair state
  const [repairing, setRepairing] = useState(false)
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null)

  // Duplicates state
  const [findingDuplicates, setFindingDuplicates] = useState(false)
  const [duplicatesCount, setDuplicatesCount] = useState<number | null>(null)
  const [deletingDuplicates, setDeletingDuplicates] = useState(false)

  // Filter states - limit is empty string by default (no limit)
  const [limit, setLimit] = useState('')
  const [sinceDate, setSinceDate] = useState('')
  const [untilDate, setUntilDate] = useState('')

  // Post count state
  const [postCount, setPostCount] = useState<number | null>(null)
  const [countLoading, setCountLoading] = useState(false)
  const [countError, setCountError] = useState(false)
  const countAbortRef = useRef<AbortController | null>(null)

  // Debounced count fetch
  const fetchCount = useCallback(async (since: string, until: string) => {
    // Cancel previous request
    if (countAbortRef.current) {
      countAbortRef.current.abort()
    }

    // If no period specified, reset count
    if (!since && !until) {
      setPostCount(null)
      setCountLoading(false)
      setCountError(false)
      return
    }

    setCountLoading(true)
    setCountError(false)
    countAbortRef.current = new AbortController()

    try {
      const params = new URLSearchParams()
      if (since) params.set('since', since)
      if (until) params.set('until', until)

      const response = await fetch(`/api/sync-facebook/count?${params.toString()}`, {
        credentials: 'include',
        signal: countAbortRef.current.signal,
      })

      if (!response.ok) {
        setCountError(true)
        setPostCount(null)
        return
      }

      const data = await response.json()
      setPostCount(data.count)
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setCountError(true)
        setPostCount(null)
      }
    } finally {
      setCountLoading(false)
    }
  }, [])

  // Debounce effect for date changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCount(sinceDate, untilDate)
    }, 300)

    return () => clearTimeout(timer)
  }, [sinceDate, untilDate, fetchCount])

  const handleFindDuplicates = async () => {
    setFindingDuplicates(true)
    setDuplicatesCount(null)
    setError(null)

    try {
      const response = await fetch('/api/find-duplicates', {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError('Erreur lors de la recherche de doublons')
        return
      }

      setDuplicatesCount(data.totalDuplicates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setFindingDuplicates(false)
    }
  }

  const handleDeleteDuplicates = async () => {
    if (!confirm('Supprimer tous les doublons ? (le plus ancien sera conserve)')) return

    setDeletingDuplicates(true)
    setError(null)

    try {
      const response = await fetch('/api/find-duplicates', {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError('Erreur lors de la suppression des doublons')
        return
      }

      setDuplicatesCount(0)
      if (data.deleted > 0) {
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setDeletingDuplicates(false)
    }
  }

  const handleRepair = async () => {
    setRepairing(true)
    setRepairResult(null)
    setError(null)

    try {
      const response = await fetch('/api/repair-posts', {
        method: 'POST',
        credentials: 'include',
      })

      const data: RepairResult = await response.json()

      if (!response.ok) {
        setError(data.errors?.[0] || `Erreur ${response.status}`)
        return
      }

      setRepairResult(data)
      if (data.repaired > 0) {
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setRepairing(false)
    }
  }

  const handleSync = async () => {
    setLoading(true)
    setProgress(null)
    setProgressHistory([])
    setError(null)

    abortRef.current = new AbortController()

    try {
      const params = new URLSearchParams()
      // Only set limit if specified (non-empty)
      if (limit.trim() !== '') {
        const parsedLimit = parseInt(limit, 10)
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          params.set('limit', Math.min(parsedLimit, 100).toString())
        }
      }
      if (sinceDate) params.set('since', sinceDate)
      if (untilDate) params.set('until', untilDate)

      const response = await fetch(`/api/sync-facebook?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        const text = await response.text()
        setError(`Erreur ${response.status}: ${text}`)
        setLoading(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setError('Streaming non supporte')
        setLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: SyncProgress = JSON.parse(line.slice(6))
              setProgress(data)

              if (data.type === 'progress' || data.type === 'info') {
                setProgressHistory(prev => [...prev.slice(-9), data])
              }

              if (data.type === 'error') {
                setError(data.message)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current.abort()
      setLoading(false)
    }
  }

  const percent = progress?.current && progress?.total
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'imported': return '#22c55e'
      case 'skipped': return '#9ca3af'
      case 'error': return '#ef4444'
      case 'importing':
      case 'importing_image': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '16px 20px',
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: '8px',
        border: '1px solid var(--theme-elevation-100)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: '16px',
        }}
      >
        {/* Limit field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--theme-elevation-800)',
            }}
          >
            Nombre de posts
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Tous"
            value={limit}
            onChange={(e) => {
              const val = e.target.value
              // Allow empty or numeric values only
              if (val === '' || /^\d+$/.test(val)) {
                setLimit(val)
              }
            }}
            onBlur={(e) => {
              // Validate on blur: max 100
              const val = e.target.value
              if (val !== '') {
                const num = parseInt(val, 10)
                if (!isNaN(num) && num > 100) {
                  setLimit('100')
                } else if (!isNaN(num) && num < 1) {
                  setLimit('')
                }
              }
            }}
            disabled={loading}
            style={{
              width: '80px',
              padding: '8px 10px',
              fontSize: '14px',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-1000)',
              opacity: loading ? 0.6 : 1,
            }}
          />
        </div>

        {/* Since date field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--theme-elevation-800)',
            }}
          >
            Depuis le
          </label>
          <input
            type="date"
            value={sinceDate}
            onChange={(e) => setSinceDate(e.target.value)}
            disabled={loading}
            style={{
              padding: '8px 10px',
              fontSize: '14px',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-1000)',
              opacity: loading ? 0.6 : 1,
            }}
          />
        </div>

        {/* Until date field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--theme-elevation-800)',
            }}
          >
            {"Jusqu'au"}
          </label>
          <input
            type="date"
            value={untilDate}
            onChange={(e) => setUntilDate(e.target.value)}
            disabled={loading}
            style={{
              padding: '8px 10px',
              fontSize: '14px',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-1000)',
              opacity: loading ? 0.6 : 1,
            }}
          />
        </div>
      </div>

      {/* Post count indicator */}
      <div
        style={{
          marginTop: '12px',
          marginBottom: '12px',
          fontSize: '13px',
          color: 'var(--theme-elevation-600)',
        }}
      >
        {countLoading && (
          <span style={{ color: 'var(--theme-elevation-500)' }}>
            Comptage en cours...
          </span>
        )}
        {!countLoading && countError && (
          <span style={{ color: '#ef4444' }}>
            Impossible de compter les posts
          </span>
        )}
        {!countLoading && !countError && postCount !== null && (
          <span style={{ color: '#1877F2', fontWeight: 500 }}>
            {postCount} post{postCount > 1 ? 's' : ''} {postCount > 1 ? 'trouves' : 'trouve'} dans cette periode
          </span>
        )}
        {!countLoading && !countError && postCount === null && !sinceDate && !untilDate && (
          <span style={{ color: 'var(--theme-elevation-500)' }}>
            Derniers posts
          </span>
        )}
      </div>

      {/* Buttons row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Sync button */}
        {!loading ? (
          <button
            onClick={handleSync}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#1877F2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1565D8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1877F2'
            }}
          >
            Synchroniser Facebook
          </button>
        ) : (
          <button
            onClick={handleCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Annuler
          </button>
        )}

        {/* Clear filters button */}
        {(sinceDate || untilDate || limit) && !loading && (
          <button
            onClick={() => {
              setSinceDate('')
              setUntilDate('')
              setLimit('')
            }}
            style={{
              padding: '10px 14px',
              backgroundColor: 'transparent',
              color: 'var(--theme-elevation-600)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Effacer filtres
          </button>
        )}

        {/* Repair button */}
        {!loading && (
          <button
            onClick={handleRepair}
            disabled={repairing}
            title="Reparer les posts qui ne s'affichent pas dans la liste"
            style={{
              padding: '10px 14px',
              backgroundColor: repairing ? '#6b7280' : '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: repairing ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!repairing) {
                e.currentTarget.style.backgroundColor = '#d97706'
              }
            }}
            onMouseLeave={(e) => {
              if (!repairing) {
                e.currentTarget.style.backgroundColor = '#f59e0b'
              }
            }}
          >
            {repairing ? 'Reparation...' : 'Reparer posts'}
          </button>
        )}

        {/* Find duplicates button */}
        {!loading && (
          <button
            onClick={handleFindDuplicates}
            disabled={findingDuplicates}
            title="Rechercher les posts en double (meme facebookId)"
            style={{
              padding: '10px 14px',
              backgroundColor: findingDuplicates ? '#6b7280' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: findingDuplicates ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!findingDuplicates) {
                e.currentTarget.style.backgroundColor = '#7c3aed'
              }
            }}
            onMouseLeave={(e) => {
              if (!findingDuplicates) {
                e.currentTarget.style.backgroundColor = '#8b5cf6'
              }
            }}
          >
            {findingDuplicates ? 'Recherche...' : 'Trouver doublons'}
          </button>
        )}
      </div>

      {/* Duplicates result */}
      {duplicatesCount !== null && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: duplicatesCount > 0 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            color: duplicatesCount > 0 ? '#7c3aed' : '#16a34a',
            border: `1px solid ${duplicatesCount > 0 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {duplicatesCount > 0 ? (
            <>
              <span>{duplicatesCount} doublon{duplicatesCount > 1 ? 's' : ''} trouve{duplicatesCount > 1 ? 's' : ''}</span>
              <button
                onClick={handleDeleteDuplicates}
                disabled={deletingDuplicates}
                style={{
                  padding: '6px 12px',
                  backgroundColor: deletingDuplicates ? '#6b7280' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: deletingDuplicates ? 'not-allowed' : 'pointer',
                }}
              >
                {deletingDuplicates ? 'Suppression...' : 'Supprimer les doublons'}
              </button>
            </>
          ) : (
            <span>Aucun doublon trouve</span>
          )}
        </div>
      )}

      {/* Progress bar */}
      {loading && progress && progress.total && (
        <div style={{ marginTop: '16px' }}>
          {/* Progress header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--theme-elevation-800)' }}>
              {progress.current || 0}/{progress.total} - {percent}%
            </span>
            <span
              style={{
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: getStatusColor(progress.status),
                color: 'white',
              }}
            >
              {progress.status === 'imported' && 'Importe'}
              {progress.status === 'skipped' && 'Ignore'}
              {progress.status === 'error' && 'Erreur'}
              {progress.status === 'importing' && 'Import...'}
              {progress.status === 'importing_image' && 'Image...'}
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--theme-elevation-100)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Current action */}
          <div
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: 'var(--theme-elevation-600)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {progress.message}
          </div>

          {/* Progress history */}
          {progressHistory.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                maxHeight: '150px',
                overflowY: 'auto',
                fontSize: '11px',
                fontFamily: 'monospace',
                backgroundColor: 'var(--theme-elevation-0)',
                border: '1px solid var(--theme-elevation-100)',
                borderRadius: '4px',
                padding: '8px',
              }}
            >
              {progressHistory.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '2px 0',
                    color: getStatusColor(item.status),
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(item.status),
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Complete message */}
      {progress && progress.type === 'complete' && !loading && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: '#16a34a',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              {progress.imported} importe{(progress.imported || 0) > 1 ? 's' : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9ca3af' }} />
              {progress.skipped} ignore{(progress.skipped || 0) > 1 ? 's' : ''}
            </span>
            {(progress.errors || 0) > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                {progress.errors} erreur{(progress.errors || 0) > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {(progress.imported || 0) > 0 && (
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Rafraichir la liste
            </button>
          )}
        </div>
      )}

      {/* Repair success message */}
      {repairResult && repairResult.success && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#d97706',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          {repairResult.message}
          {repairResult.repaired > 0 && ' - Rechargement de la page...'}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          Erreur : {error}
        </div>
      )}
    </div>
  )
}

export default SyncFacebookButton
