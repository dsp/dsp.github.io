---
title: Marking Types in Rust
date: 2024-01-22T15:45:03Z
draft: false
tags:
  - short
  - rust
  - programming
author: dsp
categories:
  - shorts
cover:
  image: cover.png
---
**Quick Overview of Using Rust's PhantomData to Encode Semantic Differences Between Types in an Efficient and Elegant Way**

# The Problem

Let's say we're writing a program with various types of IDs: user IDs, group IDs, document IDs, etc. All of these can be represented as unsigned 64-bit integers. However, semantically, they're different. A user ID shouldn't be interchangeable with a group ID or a document ID. A common approach to differentiate them in code is through naming conventions:


```rust
fn ping_user(user_id: u64) {
   //...
}
```

This method works but is prone to errors. Nothing stops us from mistakenly doing:

```rust
let group_id = new_group_id(); ping_user(group_id); // This compiles!
```

This is far from ideal. We have a powerful type system at our disposal, so why not use it to prevent such mistakes?

# A Solution

One approach is to create unique types for each ID:

```rust
struct GroupId(u64);
struct UserId(u64);
...

fn ping_user(id: UserId) {
    //...
}

ping_user(GroupId(12345)); // This triggers an error!
```

This method works but has its drawbacks:

- We need to implement traits like `Deref` separately for each type.
- We end up generating separate code for all these types, despite them having the same underlying data.

# An Arguably Better Solution

There's arguably a more elegant way to do this. The idea is to implement a generic type that holds our value and _tag_ it with a type to semantically differentiate them. Here's how:

```rust
struct Id<T> {
    inner: u64,
    _marker: std::marker::PhantomData<T>,
}
impl<T> Id<T> {
    pub fn new(inner: u64) -> Self { 
       Self {
           inner, 
           _marker: std::marker::PhantomData
        }
    }
}
struct UserIdMarker;
struct GroupIdMarker;

pub type UserId = Id<UserIdMarker>;
pub type GroupId = Id<GroupIdMarker>;
//...

fn ping_user(id: UserId) {
    //...
}
ping_user(GroupId::new(12345)); // This triggers an error

```

So, what's happening here? We define a generic type `Id<T>` to hold our value. We can implement any function on it, like `new`, and it will apply to all our IDs. The types are distinguished by marking them with a struct, using the type `std::marker::PhantomData`. Each `Id` instance is uniquely identified at the type system level.

## Ghostly

The key part here is that `std::marker::PhantomData` is purely a marker for the type system. It doesn't require runtime allocation or take any space in the structure. It's just a _tag_ on the structure at compile time.

While the initial implementation might be a bit more verbose, we gain some nice benefits:

- Methods on `Id<T>` generalize to all our IDs.
- No code duplication.
- We can still implement specific methods for a subtype, like `impl Id<GroupIdMarker> { ...}`.

Of course, there are some drawbacks. Phantom types are somewhat advanced and can be trickier to grasp for those unfamiliar with the concept.

## Generalization

We can use any type as the inner type: `String`, `Uuid`, etc. Want to separate passwords from usernames in your code? Create phantom types like `type Username = Input<UsernameMarker>`, `type Password = Input<PasswordMarker>`, and so on.

# Conclusion

Rust's type system is incredibly powerful. We can leverage it to ensure, at the type system level, that we're using semantically correct types. Phantom types offer an elegant solution for creating these distinct types.
