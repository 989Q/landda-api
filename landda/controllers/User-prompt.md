## frontend

### step 1

create nextJS use nextAuth for google login, in callback have signIn
and add this code to nextAuth

```js
  signIn: async ({ account, profile }) => {
    if (account.provider === "google") {
      // console.log("google profile", profile)
      const response = await axios.post(`http://localhost:5000/auth/google`, {
        email: profile.email,
        name: profile.name,
        image: profile.picture,
      })

      //   console.log(response.data)

      account.token = await response.data.token

      return true
    }
    return true
  },
```

## backend

### step 2

create expressjs use typescript use jwt and connect mongodb, 
create User.ts file in src/controller/User.ts
To support http://localhost:5000/auth/google from nextAuth
