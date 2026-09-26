import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { IoChevronForward, IoChevronBack } from 'react-icons/io5'
import './index.css'

const DEFAULT_STORIES = [
  {
    user_id: 'user_shafi_07',
    user_name: 'shafi _07',
    story_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop',
  },
  {
    user_id: 'user_nani',
    user_name: 'Nani 🤗',
    story_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop',
  },
  {
    user_id: 'user_anu',
    user_name: '♡__ANU__♡',
    story_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop',
  },
  {
    user_id: 'user_harsha',
    user_name: 'Harsha...',
    story_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  },
  {
    user_id: 'user_pycode',
    user_name: 'pycode.dev',
    story_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop',
  },
  {
    user_id: 'user_codenloop',
    user_name: 'codenloop',
    story_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop',
  },
  {
    user_id: 'user_flm',
    user_name: 'flm_pronetwork',
    story_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
  },
]

const NextArrow = props => {
  const { className, style, onClick } = props
  return (
    <button
      type="button"
      className="custom-story-arrow custom-story-next"
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next stories"
    >
      <IoChevronForward size={14} />
    </button>
  )
}

const PrevArrow = props => {
  const { className, style, onClick } = props
  return (
    <button
      type="button"
      className="custom-story-arrow custom-story-prev"
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous stories"
    >
      <IoChevronBack size={14} />
    </button>
  )
}

const UserStories = ({ stories = [], onClickStory }) => {
  const displayStories = stories && stories.length > 0 ? stories : DEFAULT_STORIES

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 7,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          arrows: false,
        },
      },
    ],
  }

  return (
    <div className="instagram-stories-bar">
      <Slider {...sliderSettings}>
        {displayStories.map(story => (
          <div
            className="story-slide-item"
            key={story.user_id}
            onClick={() => onClickStory && onClickStory(story)}
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                onClickStory && onClickStory(story)
              }
            }}
          >
            <div className="story-gradient-ring">
              <div className="story-white-gap">
                <img
                  src={story.story_url}
                  alt={story.user_name}
                  className="story-avatar-img"
                />
              </div>
            </div>
            <p className="story-user-label" title={story.user_name}>
              {story.user_name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default UserStories
