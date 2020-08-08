// import React, { PureComponent } from 'react'
// import withStyles from 'react-jss'
// import { post } from '../../common/api'
// import SignIn from './SignIn'
//
// const signupUrl = 'accounts/'
// const tokenUrl = 'accounts/token/'
// const styles = {}
//
// class SignUp extends PureComponent {
//     constructor(props) {
//         super(props)
//
//         this.state = {
//             // error: null,
//             name: '',
//             password: '',
//             email: '',
//             showSignIn: false,
//         }
//     }
//
//     handleChange = (event) => {
//         this.setState({ [event.target.id]: event.target.value })
//     }
//
//     validation = () => {
//         const { name, email, password } = this.state
//         const account = {
//             name,
//             password,
//             email,
//         }
//         const login = {
//             name,
//             password,
//         }
//         post(signupUrl, account)
//             .then(() => {
//                 post(tokenUrl, login)
//                     .then((response) => {
//                         console.log(response)
//                         localStorage.setItem('token', response)
//                     })
//                     .catch((error) => {
//                         console.error('Error', error)
//                     })
//             })
//             .catch((error) => {
//                 console.error('Error', error)
//             })
//     }
//
//     sendToSignIn = () => {
//         this.setState({ showSignIn: true })
//     }
//
//
//     render() {
//         const {
//             name, email, password, showSignIn,
//         } = this.state
//         return (
//             <div>
//                 {showSignIn ? <SignIn />
//                     : (
//                         <div>
//                             <form>
//                                 <label htmlFor="name">
//                                     Full Name:
//                                     <input
//                                         type="text"
//                                         id="name"
//                                         value={name}
//                                         onChange={this.handleChange}
//                                     />
//                                 </label>
//                                 <label htmlFor="email">
//                                     E-mail:
//                                     <input
//                                         type="text"
//                                         id="email"
//                                         value={email}
//                                         onChange={this.handleChange}
//                                     />
//                                 </label>
//                                 <label htmlFor="password">
//                                     Password:
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         value={password}
//                                         onChange={this.handleChange}
//                                     />
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={this.validation}
//                                 >
//                                     Sign up now!
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={this.sendToSignIn}
//                                 >
//                                     Log in
//                                 </button>
//                             </form>
//                         </div>
//                     )
//                 }
//             </div>
//         )
//     }
// }
//
// // grab all info for each item that is user id
//
// export default withStyles(styles)(SignUp)
