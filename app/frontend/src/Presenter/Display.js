import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Line from './Line'

import './Display.css'

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 * @param shabad The Shabad to render.
 * @param lineId The current line in the Shabad.
 */
const Display = ( { shabad, bani, lineId, settings } ) => {
  const { layout, theme: { 
    simpleGraphics: simple,
    backgroundImage: background,
  } } = settings

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const line = lines.find( ( { id } ) => lineId === id )

  return (
    <div className={classNames( { simple, background }, 'display' )}>
      <div className="background-image" /> 
      {line && <Line
        {...layout}
        gurmukhi={line.gurmukhi}
        englishTranslation={layout.englishTranslation && line.translation}
        punjabiTranslation={layout.punjabiTranslation && line.punjabi}
        transliteration={layout.englishTransliteration && line.transliteration}
        simpleGraphics
        />}
    </div>
  )
}

Display.defaultProps = {
  shabad: null,
  bani: null,
  lineId: null,
}

Display.propTypes = {
  lineId: PropTypes.number,
  shabad: PropTypes.shape( {
    lines: PropTypes.arrayOf( PropTypes.shape( Line.PropTypes ) ),
  } ),
  bani: PropTypes.shape( {
    lines: PropTypes.arrayOf( PropTypes.shape( Line.PropTypes ) ),
  } ),
}

export default Display
