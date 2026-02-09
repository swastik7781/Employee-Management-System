import { Schema, model } from 'mongoose';
import { IPerformanceReview } from '../types';

const ratingSchema = new Schema({
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    maxRating: { type: Number, default: 5 },
    comments: String,
}, { _id: false });

const assessmentSchema = new Schema({
    ratings: [ratingSchema],
    comments: String,
    submittedDate: { type: Date, required: true },
}, { _id: false });

const peerReviewSchema = new Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    rating: { type: Number, required: true },
    comments: String,
    submittedDate: { type: Date, required: true },
}, { _id: false });

const kpiSchema = new Schema({
    name: { type: String, required: true },
    target: { type: Number, required: true },
    achieved: { type: Number, required: true },
    unit: { type: String, required: true },
    weight: { type: Number, required: true },
    score: { type: Number, required: true },
}, { _id: false });

const goalSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed', 'cancelled'],
        default: 'not-started',
    },
    completionPercentage: { type: Number, default: 0 },
}, { _id: false });

const performanceReviewSchema = new Schema<IPerformanceReview>(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        reviewPeriod: {
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
        },
        reviewType: {
            type: String,
            enum: ['annual', 'half-yearly', 'quarterly', 'probation'],
            required: true,
        },
        selfAssessment: assessmentSchema,
        managerAssessment: assessmentSchema,
        peerReviews: [peerReviewSchema],
        kpis: [kpiSchema],
        goals: [goalSchema],
        overallRating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        strengths: [String],
        areasOfImprovement: [String],
        trainingRecommendations: [String],
        status: {
            type: String,
            enum: ['draft', 'submitted', 'under-review', 'completed'],
            default: 'draft',
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviewDate: Date,
    },
    {
        timestamps: true,
    }
);

performanceReviewSchema.index({ employee: 1, 'reviewPeriod.startDate': -1 });

export const PerformanceReview = model<IPerformanceReview>('PerformanceReview', performanceReviewSchema);
