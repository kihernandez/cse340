const pool = require("../database/")

/* ***************************
 *  Add a review
 * ************************** */
async function addReview(inv_id, account_id, rating, review_text) {
  try {
    const sql = `
      INSERT INTO public.reviews (
        inv_id, account_id, rating, review_text
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const data = await pool.query(sql, [inv_id, account_id, rating, review_text])
    return data.rows[0]
  } catch (error) {
    console.error("addReview error:", error)
    throw error
  }
}

/* ***************************
 *  Get reviews for a vehicle
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.inv_id,
        r.account_id,
        r.rating,
        r.review_text,
        r.created_at,
        a.account_firstname,
        a.account_lastname
      FROM public.reviews r
      JOIN public.account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.created_at DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error:", error)
    throw error
  }
}

/* ***************************
 *  Get a single review by ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const sql = `
      SELECT 
        review_id,
        inv_id,
        account_id,
        rating,
        review_text,
        created_at
      FROM public.reviews
      WHERE review_id = $1
    `
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  } catch (error) {
    console.error("getReviewById error:", error)
    throw error
  }
}


/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(review_id, rating, review_text) {
  try {
    const sql = `
      UPDATE public.reviews
      SET rating = $1,
        review_text = $2,
        created_at = NOW()
      WHERE review_id = $3
      RETURNING *
    `
    const data = await pool.query(sql, [rating, review_text, review_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateReview error:", error)
    throw error
  }
}


/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = `
      DELETE FROM public.reviews WHERE review_id = $1
    `
    await pool.query(sql, [review_id])
    return true
  } catch (error) {
    console.error("deleteReview error:", error)
    throw error
  }
}


module.exports = { addReview, getReviewsByInvId, getReviewById, updateReview, deleteReview }
