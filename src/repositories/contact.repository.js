import Contact from '../models/contact.model.js'

class ContactRepository {

  async addContact(ownerId, contactId) {
    return await Contact.create(
      {
        owner_id: ownerId,
        contact_id: contactId
      }
    );
  }

  async removeContact(ownerId, contactId) {
    return await Contact.findByIdAndDelete(
      {
        owner_id: ownerId,
        contact_id: contactId
      }
    )
  }

  async findByOwner(ownerId) {
    return await Contact.find(
      {
        owner_id: ownerId
      }
    ).populate("contact_id");

  }

  async findContact(ownerId, contactId) {
    return await Contact.findOne(
      {
        owner_id: ownerId,
        contact_id: contactId
      }
    ).populate("contact_id", "name phone profile_picture last_seen online");
  }

  async update(ownerId, contactId, data) {
  return await Contact.findOneAndUpdate(
    {
      owner_id: ownerId,
      contact_id: contactId,
    },
    data,
    {
      returnDocument: 'after',
    }
  );
}


 /*  async setFavorite(ownerId, contactId, favorite) {
    return await Contact.findOneAndUpdate(
      {
        owner_id: ownerId,
        contact_id: contactId
      },
      {favorite}, 
      { returnDocument: 'after' }
    )
  }


  async blockContact(ownerId, contactId) {
    return await Contact.findByIdAndUpdate(
      {
        owner_id: ownerId,
        contact_id: contactId
      },
      { blocked: true },
      { returnDocument: 'after' }
    )
  }

  async unblockContact(ownerId, contactId) {
    return await Contact.findByIdAndUpdate(
      {
        owner_id: ownerId,
        contact_id: contactId
      },
      { blocked: false },
      { returnDocument: 'after' }
    )
  }
}
 */
}

const contactRepository = new ContactRepository 
export default contactRepository