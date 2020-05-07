import React, { Component, createRef } from 'react'
import { FixedSizeList as List } from 'react-window'

function defaultEasing( delta ) {
  return delta
}

export default class AnimatedList extends Component {
  static defaultProps = {
    duration: 1000,
    easing: defaultEasing,
    onAnimationComplete: () => {},
  };

  listRef = createRef();

  scrollOffsetFinal = 0;

  scrollOffsetCurrent = 0;

  animationFrame = null

  componentDidMount() {
    if ( this.props.scrollToItem ) {
      this.initAnimation()
    }
  }

  componentDidUpdate( prevProps ) {
    if ( this.props.scrollToItem !== prevProps.scrollToItem ) {
      this.initAnimation()
    }
  }

  render() {
    return <List {...this.props} onScroll={this.onScroll} ref={this.listRef} />
  }

  animate() {
    cancelAnimationFrame( this.animationFrame )

    this.animationFrame = requestAnimationFrame( () => {
      const { duration, easing, height } = this.props
      const now = performance.now()
      const ellapsed = now - this.animationStartTime
      const scrollDelta = this.scrollOffsetFinal - this.scrollOffsetCurrent
      const easedTime = easing( Math.min( 1, ellapsed / duration ) )
      this.scrollOffsetCurrent = this.scrollOffsetCurrent + scrollDelta * easedTime

      this.listRef.current.scrollTo( this.scrollOffsetCurrent )
      if ( ellapsed < duration ) this.animate()
      else this.onAnimationComplete()
    } )
  }

  onAnimationComplete() {
    const { onAnimationComplete } = this.props

    cancelAnimationFrame( this.animationFrame )

    this.animationStartTime = undefined
    onAnimationComplete()
  }

  initAnimation() {
    const { itemSize, scrollToItem, height } = this.props
    console.log( this.scrollOffsetCurrent, this.scrollOffsetFinal, this.listRef, height, itemSize )
    this.onAnimationComplete()

    this.scrollOffsetFinal = scrollToItem * itemSize - ( height / 2 - itemSize / 2 )
    this.animationStartTime = performance.now()
    this.animate()
  }

  onScroll = ( { scrollOffset, scrollUpdateWasRequested } ) => {
    if ( !scrollUpdateWasRequested ) {
      console.log( scrollOffset )
      this.scrollOffsetCurrent = scrollOffset
    }
  };
}
