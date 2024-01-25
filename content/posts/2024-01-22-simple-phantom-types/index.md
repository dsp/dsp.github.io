---
title: Phantom Types
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
  relative: true
  alt: "A ghost sitting in front of a laptop"
---
*UPDATE Wed 24th, 2024: This article was originally called "Nominal Types". A few people on [lobste.rs](https://lobste.rs/s/12qnj3/nominal_types_rust) and [r/programming](https://www.reddit.com/r/programming/comments/19dwi7p/nominal_types_in_rust/) pointed out that naming this Nominal Types is incorrect. A better description would be **Phantom Types** or maybe **Tagged Types**.*

**Quick overview of using nominal types to encode semantic differences between types in an efficient and elegant way**
# The Problem

Let's say we're writing a program with various types of IDs: user IDs, group IDs and document IDs. These can be represented as unsigned 64-bit integers. However, semantically, they're different. A user ID shouldn't be interchangeable with a group ID or a document ID. The most common approach is to differentiate them through naming conventions:


```rust
fn ping_user(user_id: u64) {
   //...
}
```

This method works but is prone to errors. Nothing stops us from mistakenly doing:

```rust
let group_id = new_group_id(); 
ping_user(group_id); // This compiles!
```

This is far from ideal. If we were to accidentally pass a group_id into a function expecting a user_id, nothing would stop us and we would be faced with a difficult to debug production issue. This method, while very common, relies on engineers get it right 100% of the time. Can we do better? Of course we can!

In rust, we have a powerful type system at our disposal. We can use this to prevent these errors at compile time.

# A Potential Solution

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

This method works. The compile will stop us to from passing a `GroupId` where a `UserId` is expected. There are, however, some drawbacks to this specific method:

- We need to implement any methods operating on these types for each type separately. This leads to code-bloat.
- We end up generating separate code for all these types, despite them having the same underlying data.
- We might also create inconsistencies if we forget to add a method to GroupId that exists for UserId and would apply similarly to both (let's say for example a `generate_next_id` method).

# An Arguably Better Solution

There's arguably a more elegant way to do this. The idea is to implement a generic type that holds our value and _tag_ it with a type to semantically differentiate them. These types are called *Phantom Types* or *Tagged Types*. Here's how:

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

What is happening here? We define a generic type `Id<T>` to hold our value. Every method we implement on `Id<T>` will be available to all the instantiated types. We have less code-bloat and a more consistent view. But how do we semantically distinguish instantiated types? This is where [`std::marker::PhantomData`](https://doc.rust-lang.org/std/marker/struct.PhantomData.html) comes into play.

## Ghostly

At the heart of this approach is the use of `std::marker::PhantomData` to tag our generic structure. _PhantomData enables us to associate one type with another at compile time, effectively creating distinct, instantiated types from the same generic template_. For instance, `Id<UserIdMarker>` and `Id<GroupIdMarker>` are treated as separate, distinct types by the Rust compiler, preventing any mix-ups between the two. Despite this, in the compiled binary, they are identical in terms of code and size.

The beauty of PhantomData lies in its non-impact on runtime performance and memory. It doesn't require any runtime allocation, nor does it add any size to the structure. Therefore, a structure like `Id<SomeTypeMarker>` will have the same memory footprint as a simple `SomeId(u64)`. PhantomData's role is purely to maintain type information, enabling the creation of unique, type-safe identifiers. It's akin to a compile-time tag on the structure, ensuring type safety without runtime cost.

This method, while perhaps a bit more verbose initially, offers significant advantages:

- Methods defined on `Id<T>` are applicable to all our ID types, providing a unified interface.
- It eliminates the need for duplicating code for each ID type.
- It still allows for the implementation of specific methods for particular ID types, such as `impl Id<GroupIdMarker> { ...}`.

However, it's worth noting that working with phantom types can be more complex, especially for those new to the concept. They require a deeper understanding of Rust's type system but offer robust type safety in return.

## Generalization

This approach is versatile. We can apply it virtually to any type, such as `String`, `Uuid`, and more. Imagine you need to separate passwords from usernames in your code? By creating phantom types such as `type Username = Input<UsernameMarker>` and `type Password = Input<PasswordMarker>` over a generic type `Input<T>` holding a PhantomData, you can clearly enforce the separation in your code.

# Conclusion

Rust's type system is powerful. We can use it to enforce semantic correctness right at the type level. PhantomData is a neat little trick in our Rust toolbox, that allow us to create rich phantom types in our code. They are an effective strategy to write more robust and error-resistant code.
