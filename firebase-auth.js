import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const auth = getAuth();

async function createFirebaseUser(email, password) {

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log(
            "Firebase User Created:",
            userCredential.user.uid
        );

        return userCredential.user;

    } catch (error) {

        console.error(
            "Firebase Error:",
            error.code,
            error.message
        );

        alert(error.message);

        return null;
    }

}

export { createFirebaseUser };
