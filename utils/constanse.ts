/**
 * Glughub
 * from Q-overflow
 * Developed by Rupam jyoti Das 
 */

const ENDPOINT = 'https://glughub-backend.herokuapp.com/'
// const ENDPOINT = 'http://192.168.29.19:3300'

const AuthRoute = '/auth/google' //post
const AutoAuthRoute = '/auth/autoauth' //post
const LogoutRoute = '/auth/logout'  //post
const TagsRoute = "/question/tags"  //get
const QuestionCreateRoute = "/question/create"

const QuestionGetRouteBySlug = "question/q/"
const QuestionGetRouteAll = "/question/getall"


const AutoAuthProgressImg = 'https://tools.ndm.ox.ac.uk/haiku_iframes/include/images/loading.gif'

const NotLoginImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Black_x.svg/525px-Black_x.svg.png'
const NotFound404Img = 'https://redeyereloading.com/wp-content/uploads/2017/08/error-page-background-img.jpg'
const NoSearchResImg = 'https://i.gifer.com/AqDZ.gif'

const randomSuffixForQuestions: Array<string> = [
    "asked a new question  ", "has some doubt in this question", "wants to know the answer of this question ",
    "has some difficulty with this question"
]

const questionWindowSize = 20;  //amount of question fetching at a time and subsequence loadmores

const notificationWindowSize = 10

const profilePicPlaceHolder = 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
const coverPhotoPlacHolder = 'https://i.pinimg.com/originals/83/f2/8e/83f28e151f4a0b99a216abb8e0d72284.jpg'

export {
    ENDPOINT, AuthRoute, AutoAuthRoute, LogoutRoute,
    NotLoginImg, AutoAuthProgressImg, NoSearchResImg,
    NotFound404Img, TagsRoute, QuestionCreateRoute, QuestionGetRouteBySlug, QuestionGetRouteAll,
    randomSuffixForQuestions, questionWindowSize, profilePicPlaceHolder, coverPhotoPlacHolder, notificationWindowSize
}