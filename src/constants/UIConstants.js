const reactSlickSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 8,
                slidesToScroll: 8,
            },
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 7,
                slidesToScroll: 7,
                initialSlide: 7,
            },
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 6,
                slidesToScroll: 6,
                initialSlide: 6,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                initialSlide: 5,
            },
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
            },
        },
    ],
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
    },
    overlay: {
        zIndex: '2',
    },
}

export { reactSlickSettings, customStyles }
