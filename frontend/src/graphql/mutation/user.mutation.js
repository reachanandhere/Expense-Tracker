import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
    mutation SignUpUser($input: SignUpInput!) {
        signUp(input: $input) {
            _id
            name
            username
            
        }
    }
`;


export const LOGIN_USER = gql`
    mutation LoginUser($input: LoginInput!) {
        login(input: $input) {
            _id
            name
            username
            profilePicture
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout {
            message
        }
    }
`;
